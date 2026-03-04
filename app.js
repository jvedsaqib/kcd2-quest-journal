let quests = []

const container = document.getElementById("quests")
const searchInput = document.getElementById("search")
const filter = document.getElementById("filter")
const regionFilter = document.getElementById("regionFilter")

async function loadQuests(){

const res = await fetch("quests.json")
quests = await res.json()

populateRegions()

render()

}

function populateRegions(){

const regions = [...new Set(quests.map(q=>q.region))]

regions.forEach(r=>{
const opt = document.createElement("option")
opt.value=r
opt.innerText=r
regionFilter.appendChild(opt)
})

}

function render(){

container.innerHTML=""

const search = searchInput.value.toLowerCase()
const f = filter.value
const regionF = regionFilter.value

const grouped={}

quests.forEach(q=>{

if(search && !q.name.toLowerCase().includes(search)) return

if(f==="missable" && !q.notes.includes("MISSABLE")) return
if(f==="trophy" && !q.notes.includes("TROPHY")) return

if(regionF!=="all" && q.region!==regionF) return

if(!grouped[q.region]) grouped[q.region]=[]

grouped[q.region].push(q)

})

Object.keys(grouped).forEach(region=>{

const regionDiv=document.createElement("div")

const title=document.createElement("h2")
title.className="text-xl font-bold border-b mb-2"
title.innerText=region

regionDiv.appendChild(title)

grouped[region].forEach(q=>{

const id=q.region+q.name

const row=document.createElement("div")
row.className="flex items-center gap-2 p-2 rounded bg-white dark:bg-gray-800"

if(q.notes.includes("MISSABLE"))
row.classList.add("border-l-4","border-red-600")

const cb=document.createElement("input")
cb.type="checkbox"
cb.checked=localStorage.getItem(id)==="true"

cb.addEventListener("change",()=>{
localStorage.setItem(id,cb.checked)
updateProgress()
})

const label=document.createElement("span")
label.innerText=q.name

const notes=document.createElement("span")
notes.className="text-xs text-gray-500"
notes.innerText=q.notes

row.append(cb,label,notes)

regionDiv.appendChild(row)

})

container.appendChild(regionDiv)

})

updateProgress()

}

function updateProgress(){

const boxes=document.querySelectorAll("input[type=checkbox]")
const checked=document.querySelectorAll("input[type=checkbox]:checked")

const total=boxes.length
const done=checked.length

const percent=(done/total)*100

document.getElementById("progressBar").style.width=percent+"%"

document.getElementById("progressText").innerText=
`${done} / ${total} quests completed (${Math.round(percent)}%)`

}

searchInput.addEventListener("input",render)
filter.addEventListener("change",render)
regionFilter.addEventListener("change",render)

document.getElementById("reset").onclick=()=>{

if(confirm("Reset progress?")){

localStorage.clear()
render()

}

}

document.getElementById("darkToggle").onclick=()=>{
document.body.classList.toggle("dark")
}

loadQuests()
