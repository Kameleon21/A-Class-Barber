// src/pages/api/reviews.js

import crypto from 'crypto';

export const prerender = false; // Disable prerendering for this API route

export async function GET({ request }) {
  const origin = request.headers.get('origin') || '*';
  console.log('Received GET request for /api/reviews');

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACES_ID;
    console.log(`Fetching data from Google Places API with place_id: ${placeId}`);

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data fetched successfully from Google Places API');

    if (!data.result) {
      throw new Error('Invalid response from Google Places API');
    }

    // Normalize dynamic fields (e.g., convert relative_time_description to ISO string)
    const formattedData = {
      businessName: data.result.name,
      overallRating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
      reviews: data.result.reviews?.map(review => ({
        authorName: review.author_name,
        authorImage: review.profile_photo_url,
        rating: review.rating,
        text: review.text,
        date: new Date(review.time * 1000).toISOString(), // Convert UNIX timestamp to ISO string
        language: review.language
      })) || []
    };
    console.log('Formatted data:', formattedData);

    // Generate ETag based on the response content
    const etag = crypto.createHash('sha1').update(JSON.stringify(formattedData)).digest('hex');
    console.log(`Generated ETag: ${etag}`);

    // Check for If-None-Match header
    const ifNoneMatch = request.headers.get('If-None-Match');
    console.log(`If-None-Match Header: ${ifNoneMatch}`);

    if (ifNoneMatch === etag) {
      console.log('ETag matched. Returning 304 Not Modified.');
      return new Response(null, {
        status: 304,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=60',
        }
      });
    }

    console.log('ETag did not match. Returning 200 OK with data.');
    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=60',
        'ETag': etag
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);

    return new Response(JSON.stringify({
      error: "Failed to fetch reviews",
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET'
      }
    });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS({ request }) {
  const origin = request.headers.get('origin') || '*';
  console.log('Received OPTIONS request for /api/reviews');

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Max-Age': '86400',
    }
  });
}
