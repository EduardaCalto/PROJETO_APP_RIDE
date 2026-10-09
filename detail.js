const params = new URLSearchParams(window.location.search)
const rideID = params.get("id")
const ride = getRideRecord(rideID)

document.addEventListener("DOMContentLoaded",async()=>{

    // ride inexistente ou sem posições: volta para a lista
    if(!ride || !ride.data || ride.data.length === 0){
        window.location.href = "./index.html"
        return
    }

    const firstPosition = ride.data[0]

    const dataElement = document.createElement("div")
    dataElement.className = "d-flex flex-column"


    const cityDiv = document.createElement("div")
    cityDiv.innerText = "Loading location..."
    cityDiv.className = "text-primary fw-semibold fs-5"

    const dateDiv = document.createElement("div")
    dateDiv.innerHTML = `<i class="bi bi-calendar3 me-1"></i>${getStartDate(ride)}`
    dateDiv.className = "text-secondary small mb-3"

    const statsRow = document.createElement("div")
    statsRow.className = "row g-2"
    statsRow.innerHTML = `
        <div class="col-4">
            <div class="stat-card shadow-sm">
                <i class="bi bi-speedometer2 text-primary"></i>
                <div class="stat-value">${getMaxSpeed(ride.data)}</div>
                <div class="stat-label">Max Km/h</div>
            </div>
        </div>
        <div class="col-4">
            <div class="stat-card shadow-sm">
                <i class="bi bi-signpost text-primary"></i>
                <div class="stat-value">${getDistance(ride.data)}</div>
                <div class="stat-label">Km</div>
            </div>
        </div>
        <div class="col-4">
            <div class="stat-card shadow-sm">
                <i class="bi bi-stopwatch text-primary"></i>
                <div class="stat-value">${getDuration(ride)}</div>
                <div class="stat-label">Duration</div>
            </div>
        </div>
    `

    dataElement.appendChild(cityDiv)
    dataElement.appendChild(dateDiv)
    dataElement.appendChild(statsRow)

    document.querySelector("#data").appendChild(dataElement)

    const deleteButton = document.querySelector("#deleteBtn")
    deleteButton.addEventListener("click", ()=> {

        if(!confirm("Delete this ride?"))
            return

        deleteRide(rideID)
        window.location.href = "./index.html"
    })

    const map = L.map("mapDetail")
    map.setView([firstPosition.latitude,firstPosition.longitude],12)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: 19,
	    //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    const positionsArray =  ride.data.map((position=>{
        return[position.latitude,position.longitude]
    }))

    const polyline = L.polyline(positionsArray,{ color: "#29c5cf", weight: 5})
    polyline.addTo(map)

    map.fitBounds(polyline.getBounds())

    // a cidade carrega depois, para não travar o mapa e os dados
    try{
        const firstLocationData = await getLocationData(firstPosition.latitude,firstPosition.longitude)
        cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`
    }catch(error){
        cityDiv.innerText = "Unknown location"
    }

})
