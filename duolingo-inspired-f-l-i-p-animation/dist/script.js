const destination = document.querySelector(".destination");
const origin = document.querySelector(".origin");
const words = origin.querySelectorAll(".word");
const verificarBtn = document.getElementById('verificarBtn');

let isAnimating = false;

// FLIP technique animation (First Last Invert Play)
const flip = (word, settings) => {
    const invert = {
        x: settings.first.left - settings.last.left,
        y: settings.first.top - settings.last.top
    };

    let animation = word.animate(
        [
            { transform: `scale(1,1) translate(${invert.x}px, ${invert.y}px)` },
            { transform: `scale(1,1) translate(0, 0)` }
        ],
        {
            duration: 300,
            easing: "ease"
        }
    );

    animation.onfinish = () => (isAnimating = false);
};

const move = (word, toDestination) => {
    const id = Math.random();
    const container = word.closest(".container");
    let rect = word.getBoundingClientRect();
    let first, last;

    isAnimating = true;

    container.dataset.id = id;
    word.dataset.id = id;

    container.style.height = `${word.offsetHeight}px`;
    container.style.width = `${word.offsetWidth}px`;

    first = { top: rect.top, left: rect.left };

    if (toDestination) {
        destination.insertAdjacentElement("beforeend", word);
    } else {
        origin.querySelector(`[data-id="${id}"]`).insertAdjacentElement("beforeend", word);
    }

    rect = word.getBoundingClientRect();
    last = { top: rect.top, left: rect.left };

    flip(word, { first, last });
};

words.forEach((word) => {
    const event = () => {
        if (isAnimating) return;
        if (word.closest(".origin")) {
            move(word, true);
        } else {
            move(word, false);
        }
    };

    word.addEventListener("click", event);
});

document.addEventListener('DOMContentLoaded', () => {
    const sentencas = [
      ['print', '(', '"', 'Hello World!', '"', ')'],
      ['for', 'i', 'in', 'range', '(', '10', ')', ':'],
      ['if', 'x', '>', 'y', ':'],
      ['def', 'func', '(', ')', ':'],
      ['while', 'True', ':']
    ];
  
    const origin = document.querySelector('.origin');
    const destino = document.querySelector('.destination');
    const verificarBtn = document.getElementById('verificarBtn');
    let isAnimating = false;
    let selecionados = [];
  
    // Função para selecionar uma sentença aleatória
    function selecionarSentencaAleatoria() {
      const randomIndex = Math.floor(Math.random() * sentencas.length);
      return sentencas[randomIndex];
    }
  
    // Função para criar botões com palavras aleatórias
    function criarBotoesAleatorios(palavras) {
      // Limpa os botões existentes antes de criar novos
      origin.innerHTML = '';
  
      palavras.forEach(palavra => {
        const container = document.createElement('div');
        container.className = 'container';
  
        const button = document.createElement('button');
        button.className = 'word';
        button.textContent = palavra;
  
        container.appendChild(button);
        origin.appendChild(container);
      });
  
      // Reatribui event listeners aos novos botões
      const buttons = document.querySelectorAll('.word');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          if (isAnimating) return;
  
          const parent = button.closest(".origin");
          const primeiraPos = button.getBoundingClientRect();
  
          if (parent) {
            destino.appendChild(button);
            selecionados.push(button.textContent);
          } else {
            origin.appendChild(button);
            selecionados = selecionados.filter(word => word !== button.textContent);
          }
  
          const ultimaPos = button.getBoundingClientRect();
          const deltaX = primeiraPos.left - ultimaPos.left;
          const deltaY = primeiraPos.top - ultimaPos.top;
  
          button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          button.style.transition = 'transform 0s';
  
          requestAnimationFrame(() => {
            button.style.transform = '';
            button.style.transition = 'transform 0.3s ease';
          });
  
          verificarBtn.style.display = selecionados.length === buttons.length ? 'block' : 'none';
        });
      });
    }
  
    // Seleciona uma sentença aleatória ao carregar a página
    const sentencaAtual = selecionarSentencaAleatoria();
    const novaSentenca = selecionarSentencaAleatoria();
    criarBotoesAleatorios(sentencaAtual);
  
    verificarBtn.addEventListener('click', () => {
      let corretas = true;
  
      for (let i = 0; i < sentencaAtual.length; i++) {
        if (selecionados[i] !== sentencaAtual[i]) {
          corretas = false;
          break;
        }
      }
  
      if (corretas) {
        alert('Parabéns! A ordem está correta.');
        destino.innerHTML = '';
        criarBotoesAleatorios(novaSentenca);
        selecionados = [];
        verificarBtn.style.display = 'none';
  
      } else {
        alert('Ops! A ordem está incorreta. Tente novamente.');
        destino.innerHTML = '';
        criarBotoesAleatorios(sentencaAtual);
        selecionados = [];
        verificarBtn.style.display = 'none';
      }
      
    });
  });
  
  