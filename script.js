'use strict'

const url = `http://localhost:3000`


async function getFotos() {

  const response = await fetch(`${url}/fotos`)
  const data = await response.json()
  return data
}

async function buscarFoto() {
  
  try {
    const response = await fetch(`${url}/fotos`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()

    return data.fotos || []
  } catch (error) {
    return []
  }
}

async function carregarFotos() {
    fotoContainer.appendChild()
    let img = await buscarFoto()

    //buscar midias relacinadas
    for(const foto of img){
        try {
            img.imagem= await buscarFoto(foto.id)
        } catch (error) {
            img.imagem = []
        }
    }
}

const fotoContainer = document.getElementById('galeria')
function criarCard(foto) {
  const card = document.createElement('div')
  card.classList.add('card')

  const img = document.createElement('img')
  img.src = foto.imagem
  img.alt = foto.titulo

  const legenda = document.createElement('p')
  legenda.textContent = foto.legenda

  const data = document.createElement('p')
  data.textContent = foto.data

  card.appendChild(img)
  card.appendChild(legenda)
  card.appendChild(data)

  fotoContainer.appendChild(card)
}

async function carregarSlide() {
  
  const fotos = await getFotos()
  fotos.forEach(criarCard)
}

window.addEventListener('load', carregarSlide)


