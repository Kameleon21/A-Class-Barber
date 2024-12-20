import { getStore } from "@netlify/blobs";

const CACHE_KEY = 'google-reviews';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// At the top of your getCachedData function
async function getCachedData() {
  try {
    console.log('Checking KV store for cached data...');
    const store = getStore('reviews');
    const data = await store.get(CACHE_KEY);
    
    if (!data) {
      console.log('No cached data found');
      return null;
    }
    
    const { timestamp, content } = JSON.parse(data);
    const age = Date.now() - timestamp;
    console.log(`Cache age: ${Math.round(age / 1000)} seconds`);
    
    if (age < CACHE_DURATION) {
      console.log('Returning cached data');
      return content;
    }
    console.log('Cache expired');
    return null;
  } catch (error) {
    console.error('Error reading from KV store:', error);
    return null;
  }
}

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACES_ID;

    // Try to get cached data first
    const cachedData = await getCachedData();
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': `public, max-age=${CACHE_DURATION / 1000}`
        }
      });
    }

    // Fetch fresh data if cache miss or expired
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result) {
      throw new Error('Invalid response from Google Places API');
    }
    
    // Format the response data
    const formattedData = {
      businessName: data.result.name,
      overallRating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
      reviews: data.result.reviews?.map(review => ({
        authorName: review.author_name,
        authorImage: review.profile_photo_url,
        rating: review.rating,
        text: review.text,
        date: review.relative_time_description,
        language: review.language
      })) || []
    };

    // Cache the formatted data
    await cacheData(formattedData);

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CACHE_DURATION / 1000}`
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