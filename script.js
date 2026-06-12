/* ==========================================================================
   AGENDA SOLO — Comportamentos da Página (JavaScript)
   --------------------------------------------------------------------------
   Cada bloco é uma função pequena e independente, com nome em português,
   para facilitar a manutenção por um dev junior.

   Índice:
     1. MENU DO CELULAR
     2. FORMULÁRIO DE CADASTRO
     3. ANO DO RODAPÉ
     4. ANIMAÇÃO DE ENTRADA DAS SEÇÕES
     5. FAQ ACORDEÃO

   Tudo é iniciado no final, dentro de "iniciar()".
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. MENU DO CELULAR
   -------------------------------------------------------------------------- */
function configurarMenu() {
  const botao = document.getElementById("menu-botao");
  const menu = document.getElementById("menu-navegacao");
  if (!botao || !menu) return;

  function alternarMenu() {
    const estaAberto = menu.classList.toggle("aberto");
    botao.classList.toggle("ativo", estaAberto);
    botao.setAttribute("aria-expanded", String(estaAberto));
    botao.setAttribute("aria-label", estaAberto ? "Fechar menu" : "Abrir menu");
  }

  botao.addEventListener("click", alternarMenu);

  // Fecha o menu ao clicar em qualquer link interno.
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("aberto");
      botao.classList.remove("ativo");
      botao.setAttribute("aria-expanded", "false");
    });
  });
}


/* --------------------------------------------------------------------------
   2. FORMULÁRIO DE CADASTRO
   -------------------------------------------------------------------------- */
function configurarFormulario() {
  const formulario = document.getElementById("formulario-cadastro");
  const mensagem = document.getElementById("formulario-mensagem");
  if (!formulario || !mensagem) return;

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campoNome = document.getElementById("campo-nome");
    const campoEmail = document.getElementById("campo-email");
    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();

    campoNome.classList.remove("campo--erro");
    campoEmail.classList.remove("campo--erro");

    if (nome.length < 2) {
      campoNome.classList.add("campo--erro");
      mensagem.textContent = "Por favor, informe o seu nome.";
      return;
    }

    if (!emailValido(email)) {
      campoEmail.classList.add("campo--erro");
      mensagem.textContent = "Digite um e-mail válido para continuar.";
      return;
    }

    mensagem.textContent = "Tudo certo, " + nome + "! Em breve entraremos em contato. 🎉";
    formulario.reset();
  });
}


/* --------------------------------------------------------------------------
   3. ANO DO RODAPÉ
   -------------------------------------------------------------------------- */
function configurarAnoRodape() {
  const elementoAno = document.getElementById("ano-atual");
  if (elementoAno) elementoAno.textContent = new Date().getFullYear();
}


/* --------------------------------------------------------------------------
   4. ANIMAÇÃO DE ENTRADA DAS SEÇÕES
   -------------------------------------------------------------------------- */
function configurarAnimacaoEntrada() {
  // Removemos elementos individuais de carrossel do seletor para evitar bugs de scroll horizontal
  const alvos = document.querySelectorAll(
    ".historia, .recurso, .modo, .plano, .taxa-zero, .depoimento, .fluxo__passo, .vitrine__texto, .painel-mock, .tabela-comp, .faq__item, .publico__cabecalho, .marcas"
  );
  if (alvos.length === 0) return;

  alvos.forEach(function (alvo) {
    alvo.style.opacity = "0";
    alvo.style.transform = "translateY(24px)";
    alvo.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.style.opacity = "1";
          entrada.target.style.transform = "translateY(0)";
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  alvos.forEach(function (alvo) { observador.observe(alvo); });
}


/* --------------------------------------------------------------------------
   5. FAQ ACORDEÃO
   Abre/fecha cada pergunta. Permite mais de uma aberta ao mesmo tempo.
   -------------------------------------------------------------------------- */
function configurarFaq() {
  const itens = document.querySelectorAll(".faq__item");
  if (itens.length === 0) return;

  itens.forEach(function (item) {
    const botao = item.querySelector(".faq__pergunta");
    const resposta = item.querySelector(".faq__resposta");
    if (!botao || !resposta) return;

    botao.addEventListener("click", function () {
      const aberto = item.classList.toggle("faq__item--aberto");
      botao.setAttribute("aria-expanded", String(aberto));
      if (aberto) {
        resposta.style.maxHeight = resposta.scrollHeight + "px";
      } else {
        resposta.style.maxHeight = "0";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. CARROSSEIS HORIZONTAIS (Dinâmico para Tamanhos Responsivos)
   -------------------------------------------------------------------------- */
function configurarCarrossel(idFaixa, idAnterior, idProximo, obterPassoFn) {
  const faixa = document.getElementById(idFaixa);
  const anterior = document.getElementById(idAnterior);
  const proximo = document.getElementById(idProximo);
  if (!faixa || !anterior || !proximo) return;

  anterior.addEventListener("click", function () {
    const passo = typeof obterPassoFn === "function" ? obterPassoFn() : obterPassoFn;
    faixa.scrollBy({ left: -passo, behavior: "smooth" });
  });
  
  proximo.addEventListener("click", function () {
    const passo = typeof obterPassoFn === "function" ? obterPassoFn() : obterPassoFn;
    faixa.scrollBy({ left: passo, behavior: "smooth" });
  });
}

function configurarCarrosselDestaqueCentro() {
  const faixa = document.getElementById("publico-faixa");
  const pontosContainer = document.getElementById("publico-pontos");
  if (!faixa) return;

  const cards = faixa.querySelectorAll(".publico__card");
  if (cards.length === 0) return;

  // Cria um ponto (bolinha) para cada card
  if (pontosContainer) {
    cards.forEach(function (_, indice) {
      const ponto = document.createElement("button");
      ponto.type = "button";
      ponto.className = "publico__ponto";
      ponto.setAttribute("aria-label", "Ir para o card " + (indice + 1));
      ponto.addEventListener("click", function () {
        cards[indice].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      pontosContainer.appendChild(ponto);
    });
  }

  const pontos = pontosContainer ? pontosContainer.querySelectorAll(".publico__ponto") : [];

  function checarCardCentral() {
    const containerProporcoes = faixa.getBoundingClientRect();
    const centroDoContainer = containerProporcoes.left + (containerProporcoes.width / 2);

    let indiceMaisProximo = 0;
    let menorDistancia = Infinity;

    cards.forEach(function (card, indice) {
      const cardProporcoes = card.getBoundingClientRect();
      const centroDoCard = cardProporcoes.left + (cardProporcoes.width / 2);
      const distancia = Math.abs(centroDoContainer - centroDoCard);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        indiceMaisProximo = indice;
      }
    });

    cards.forEach(function (card, indice) {
      card.classList.toggle("ativo", indice === indiceMaisProximo);
    });

    pontos.forEach(function (ponto, indice) {
      ponto.classList.toggle("ativo", indice === indiceMaisProximo);
    });
  }

  faixa.addEventListener("scroll", checarCardCentral, { passive: true });
  window.addEventListener("resize", checarCardCentral, { passive: true });

  checarCardCentral();
}

function configurarCarrosselMarcas() {
  configurarCarrossel("marcas-faixa", "marcas-anterior", "marcas-proximo", 300);
}

function configurarCarrosselPublico() {
  configurarCarrossel("publico-faixa", "publico-anterior", "publico-proximo", function() {
    const primeiroCard = document.querySelector("#publico-faixa .publico__card");
    if (primeiroCard) {
      return primeiroCard.offsetWidth + 20;
    }
    return 310;
  });

  configurarCarrosselDestaqueCentro();
}


/* --------------------------------------------------------------------------
   7. CONFIGURAÇÃO DO BOTÃO VOLTAR AO TOPO
   -------------------------------------------------------------------------- */
function configurarBotaoTopo() {
  const botaoTopo = document.getElementById("botao-topo");
  if (!botaoTopo) return;

  // Mostra ou esconde o botão dependendo da rolagem da página
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      botaoTopo.classList.add("visivel");
    } else {
      botaoTopo.classList.remove("visivel");
    }
  }, { passive: true });

  // Ação de clique para rolar de volta ao topo suavemente
  botaoTopo.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* --------------------------------------------------------------------------
   INICIALIZAÇÃO
   -------------------------------------------------------------------------- */
function iniciar() {
  // Chamadas das suas funções existentes
  if (typeof configurarMenu === "function") configurarMenu();
  if (typeof configurarFormulario === "function") configurarFormulario();
  if (typeof configurarAnoRodape === "function") configurarAnoRodape();
  if (typeof configurarAnimacaoEntrada === "function") configurarAnimacaoEntrada();
  if (typeof configurarFaq === "function") configurarFaq();
  if (typeof configurarCarrosselMarcas === "function") configurarCarrosselMarcas();
  if (typeof configurarCarrosselPublico === "function") configurarCarrosselPublico();
  
  // Nova funcionalidade integrada
  configurarBotaoTopo();
}

// Executa a inicialização assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", iniciar);

