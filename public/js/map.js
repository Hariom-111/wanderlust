mapboxgl.accessToken = mapToken;


  // Initialize map
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
  });

  

  const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
  .setHTML(`
    <div class="custom-popup">
    <h5>${listing.title}<h5><p>Exact Location will be provided after booking!</p>
    </div>
    `)
  )
  .addTo(map);

  


   