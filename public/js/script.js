const socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
});

// ** Send Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log("Error", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

// ** Create Leaflet Map
const map = L.map("map").setView([0, 0], 18);

// ** Create Tile Layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ** Create Marker
const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
})

socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        // markers[id].remove();
        delete markers[id];
    }
});