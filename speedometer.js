const speedElement = document.querySelector("#speed")
const startBtn = document.querySelector("#start")
const stopBtn = document.querySelector("#stop")
const statusElement = document.querySelector("#status")

function setStatus(text, color){
    statusElement.innerText = text
    statusElement.className = `badge rounded-pill text-bg-${color} mb-3`
}

let watchId = null
let currentRide = null
startBtn.addEventListener("click",() => {

    if(watchId)
        return
        
    function handleSuccess(position){
        addPosition(currentRide,position)
        setStatus("Recording", "success")
        speedElement.innerText = position.coords.speed ? // se speed for nulo retorna 0 , no caso o speed aq retorna como metros por seg , ent usei 3.6
        (position.coords.speed *3.6).toFixed(1):0 
    }

    function handleError(error){
        console.log(error.message)
        setStatus("GPS unavailable", "warning")
    }

    const options = { enableHighAccuracy:true}
    currentRide = createNewRide() //criando o dado antes de inicializar o wathPosition
    watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options)
    setStatus("Waiting for GPS...", "info")
    startBtn.classList.add("d-none")
    stopBtn.classList.remove("d-none")

})

stopBtn.addEventListener("click", () => {
    
    if(!watchId)
        return
    navigator.geolocation.clearWatch(watchId)
    watchId = null
    updateStopTime(currentRide)
    currentRide = null
    startBtn.classList.remove("d-none")
    stopBtn.classList.add("d-none")
    window.location.href = "./index.html"
    
})
