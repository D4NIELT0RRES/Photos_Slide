const imagens = [
  'https://via.placeholder.com/300x200?text=Foto+1',
  'https://via.placeholder.com/300x200?text=Foto+2',
  'https://via.placeholder.com/300x200?text=Foto+3'
];

let indice = 0;

function mostrarImagem() {
  document.getElementById('imagem').src = imagens[indice];
}

function proximo() {
  indice = (indice + 1) % imagens.length;
  mostrarImagem();
}

function voltar() {
  indice = (indice - 1 + imagens.length) % imagens.length;
  mostrarImagem();
}

// Trocar imagem automaticamente a cada 3 segundos
setInterval(proximo, 3000);