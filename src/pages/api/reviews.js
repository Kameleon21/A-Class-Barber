export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACES_ID;
    const CACHE_DURATION = 3600; // Cache for 1 hour

    // Try to get cached data first
    const cachedData = await getCachedData();
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_DURATION}`
        }
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,reviews,userRatingCount'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Format the response data
    const formattedData = {
      businessName: data.result.name,
      overallRating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
      reviews: data.result.reviews.map(review => ({
        authorName: review.author_name,
        authorImage: review.profile_photo_url,
        rating: review.rating,
        text: review.text,
        date: review.relative_time_description,
        language: review.language
      }))
    };

    // Cache the formatted data
    await cacheData(formattedData);

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CACHE_DURATION}`
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
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Cache implementation using localStorage or other storage mechanism
async function getCachedData() {
  try {
    const cache = await caches.open('reviews-cache');
    const cachedResponse = await cache.match('reviews');
    if (cachedResponse) {
      const data = await cachedResponse.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

async function cacheData(data) {
  try {
    const cache = await caches.open('reviews-cache');
    await cache.put('reviews', new Response(JSON.stringify(data)));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}
  