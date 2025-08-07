'use strict'

const url = `http://localhost:3000`

// Elementos do DOM
const containerFotos = document.querySelector('.container-galeria')
const btnAnterior = document.querySelector('.botao-anterior')
const btnProximo = document.querySelector('.botao-proximo')

// Variáveis do slider
let fotos = []
let indiceAtual = 0

async function buscarFotos() {
  try {
    const resposta = await fetch(`${url}/fotos`)
    if (!resposta.ok) {
      throw new Error('Resposta da rede não foi ok')
    }
    const dados = await resposta.json()
    return dados.fotos || dados || []
  } catch (erro) {
    console.error('Erro ao buscar fotos:', erro)
    return []
  }
}

function criarCard(foto) {
  const card = document.createElement('div')
  card.classList.add('card')

  const img = document.createElement('img')
  img.src = foto.imagem
  img.alt = foto.titulo || 'Imagem'

  const legenda = document.createElement('p')
  legenda.textContent = foto.legenda || foto.titulo || ''

  const data = document.createElement('p')
  data.textContent = foto.data || ''

  card.appendChild(img)
  card.appendChild(legenda)
  card.appendChild(data)

  return card
}

function renderizarSlider() {
  containerFotos.innerHTML = ''
  
  if (fotos.length === 0) {
    const semFotos = document.createElement('div')
    semFotos.classList.add('sem-fotos')
    semFotos.innerHTML = '<p>Nenhuma foto encontrada</p>'
    containerFotos.appendChild(semFotos)
    return
  }

  // Garante que o índice está dentro dos limites (loop infinito)
  const idx = ((indiceAtual % fotos.length) + fotos.length) % fotos.length
  const foto = fotos[idx]
  
  const card = criarCard(foto)
  containerFotos.appendChild(card)
  
  // Atualiza indicadores se existirem
  atualizarIndicadores()
}

function proximoSlide() {
  if (fotos.length === 0) return
  indiceAtual = (indiceAtual + 1) % fotos.length
  renderizarSlider()
}

function anteriorSlide() {
  if (fotos.length === 0) return
  indiceAtual = (indiceAtual - 1 + fotos.length) % fotos.length
  renderizarSlider()
}

function atualizarIndicadores() {
  // Remove indicadores antigos
  const indicadoresAntigos = document.querySelector('.indicadores')
  if (indicadoresAntigos) {
    indicadoresAntigos.remove()
  }

  if (fotos.length <= 1) return

  // Cria novos indicadores
  const indicadores = document.createElement('div')
  indicadores.classList.add('indicadores')

  for (let i = 0; i < fotos.length; i++) {
    const indicador = document.createElement('div')
    indicador.classList.add('indicador')
    if (i === indiceAtual) {
      indicador.classList.add('ativo')
    }
    indicador.addEventListener('click', () => {
      indiceAtual = i
      renderizarSlider()
    })
    indicadores.appendChild(indicador)
  }

  // Adiciona indicadores após o slider
  const containerSlider = document.querySelector('.container-slider')
  containerSlider.appendChild(indicadores)
}

// Navegação com teclado
function tratarTeclaPressionada(evento) {
  if (evento.key === 'ArrowLeft') {
    anteriorSlide()
  } else if (evento.key === 'ArrowRight') {
    proximoSlide()
  }
}

// Auto-play (opcional)
let intervaloAutoPlay = null

function iniciarAutoPlay() {
  if (fotos.length <= 1) return
  intervaloAutoPlay = setInterval(proximoSlide, 3000) // Muda a cada 3 segundos
}

function pararAutoPlay() {
  if (intervaloAutoPlay) {
    clearInterval(intervaloAutoPlay)
    intervaloAutoPlay = null
  }
}

async function iniciarSlider() {
  try {
    fotos = await buscarFotos()
    renderizarSlider()
    
    // Adiciona event listeners
    btnAnterior.addEventListener('click', anteriorSlide)
    btnProximo.addEventListener('click', proximoSlide)
    document.addEventListener('keydown', tratarTeclaPressionada)
    
    // Auto-play
    iniciarAutoPlay()
    
    // Pausa auto-play quando o mouse está sobre o slider
    const containerSlider = document.querySelector('.container-slider')
    containerSlider.addEventListener('mouseenter', pararAutoPlay)
    containerSlider.addEventListener('mouseleave', iniciarAutoPlay)
    
  } catch (erro) {
    console.error('Erro ao inicializar slider:', erro)
  }
}

// Inicializa quando a página carrega
window.addEventListener('load', iniciarSlider)


