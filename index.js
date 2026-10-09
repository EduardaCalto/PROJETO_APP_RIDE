const rideListElement = document.querySelector("#rideList")
const emptyStateElement = document.querySelector("#emptyState")

// só mostra rides que têm pelo menos uma posição, da mais recente para a mais antiga
const AllRides = getAllRides()
    .map(([id,value]) => {
        const ride = JSON.parse(value)
        ride.id = id
        return ride
    })
    .filter(ride => ride.data && ride.data.length > 0)
    .sort((a,b) => b.startTime - a.startTime)

if(AllRides.length === 0)
    emptyStateElement.classList.remove("d-none")

AllRides.forEach(async(ride) =>{

    const itemElement = document.createElement("li")
    itemElement.id = ride.id
    itemElement.className = "ride-card d-flex p-2 align-items-center shadow-sm gap-3"   //alterado para td vez q a pagina for recarregada os dados n forem chamados primeiro e n ficar trocando na hr q carregar
    rideListElement.appendChild(itemElement)

    itemElement.addEventListener("click", () => {
        window.location.href= `./detail.html?id=${ride.id}`
    })

    const firstPosition = ride.data[0]

    const mapID = `map${ride.id}`
    const mapElement = document.createElement("div")
    mapElement.id = mapID
    mapElement.className = "ride-map bg-secondary rounded-4"

    const dataElement = document.createElement("div")
    dataElement.className = "flex-fill d-flex flex-column"


    const cityDiv = document.createElement("div")
    cityDiv.innerText = "Loading location..."
    cityDiv.className = "text-primary fw-semibold mb-1"

    const maxSpeedDiv = document.createElement("div")
    maxSpeedDiv.innerHTML = `<i class="bi bi-speedometer2 me-1"></i>${getMaxSpeed(ride.data)} Km/h`
    maxSpeedDiv.className = "h5 mb-1"

    const statsDiv = document.createElement("div")
    statsDiv.className = "d-flex gap-3 small"
    statsDiv.innerHTML = `
        <span><i class="bi bi-signpost me-1"></i>${getDistance(ride.data)} Km</span>
        <span><i class="bi bi-stopwatch me-1"></i>${getDuration(ride)}</span>
    `

    const dateDiv = document.createElement("div")
    dateDiv.innerHTML = `<i class="bi bi-calendar3 me-1"></i>${getStartDate(ride)}`
    dateDiv.className = "text-secondary small mt-1"

    dataElement.appendChild(cityDiv)
    dataElement.appendChild(maxSpeedDiv)
    dataElement.appendChild(statsDiv)
    dataElement.appendChild(dateDiv)

    itemElement.appendChild(mapElement)
    itemElement.appendChild(dataElement)

    const chevron = document.createElement("i")
    chevron.className = "bi bi-chevron-right text-secondary"
    itemElement.appendChild(chevron)

    const map = L.map(mapID,{
        attributionControl:  false,
        zoomControl: false,
        dragging: false
        //scrollWheelZoom: false , para tirar o zoom do mapa
    })
    map.setView([firstPosition.latitude,firstPosition.longitude],12)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: 19,
	    //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([firstPosition.latitude,firstPosition.longitude]).addTo(map)

    // a cidade carrega depois, para não travar o resto do card
    try{
        const firstLocationData = await getLocationData(firstPosition.latitude,firstPosition.longitude)
        cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`
    }catch(error){
        cityDiv.innerText = "Unknown location"
    }

})
