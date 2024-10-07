function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 37.7749, lng: -122.4194 }, // Initial map center
    });
  
    const locations = [
      { lat: 37.7749, lng: -122.4194, title: "San Francisco", description: "A popular city in California." },
      { lat: 34.0522, lng: -118.2437, title: "Los Angeles", description: "The entertainment capital of the world." },
    ];
  
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.title,
      });
  
      const infowindow = new google.maps.InfoWindow({
        content: `<h3>${location.title}</h3><p>${location.description}</p>`,
      });
  
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    });
  }
  
  window.onload = initMap;
  