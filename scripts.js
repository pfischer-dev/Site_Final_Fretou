window.addEventListener("scroll", function () {
    const header = document.getElementById("header");

    if (window.scrollY > 80) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ==========================
   VALIDAÇAO DE FORMULARIO
========================== */
const form = document.querySelector(".fale-form form");
const campos = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email"),
  telefone: document.getElementById("telefone"),
  assunto: document.getElementById("assunto")
};

// Função para exibir erro
function mostrarErro(campo, mensagem) {
  campo.classList.add("input-error");
  const erroMsg = document.createElement("p");
  erroMsg.classList.add("error-text");
  erroMsg.innerText = mensagem;
  campo.insertAdjacentElement("afterend", erroMsg);
}

// Remover erros anteriores
function limparErros() {
  document.querySelectorAll(".error-text").forEach(e => e.remove());
  document.querySelectorAll(".input-error").forEach(c => c.classList.remove("input-error"));
}

// Valida Email
function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Valida Telefone (mínimo 8 números)
function validarTelefone(tel) {
  return tel.replace(/\D/g, "").length >= 8;
}

// Evento principal do formulário
form.addEventListener("submit", function (e) {
  limparErros();
  let valido = true;

  if (campos.nome.value.trim().length < 3) {
    mostrarErro(campos.nome, "Digite um nome válido (mín. 3 letras)");
    valido = false;
  }

  if (!validarEmail(campos.email.value)) {
    mostrarErro(campos.email, "Digite um e-mail válido");
    valido = false;
  }

  if (!validarTelefone(campos.telefone.value)) {
    mostrarErro(campos.telefone, "Digite um telefone válido");
    valido = false;
  }

  if (campos.assunto.value.trim().length < 5) {
    mostrarErro(campos.assunto, "Digite uma mensagem com mais detalhes");
    valido = false;
  }

 // Controle de envio
if (!valido) {
  e.preventDefault(); // Impede envio
} else {
  e.preventDefault(); // Impede envio normal

  // Exibir mensagem de sucesso
const msgBox = document.getElementById("msg-sucesso");
msgBox.style.display = "block";

// Some com a mensagem após 4s
setTimeout(() => {
  msgBox.classList.add("hide");
}, 3500);

setTimeout(() => {
  msgBox.style.display = "none";
  msgBox.classList.remove("hide");
}, 4300);

// Limpar o formulário
form.reset();


}
});

/* ==========================
   BOTÃO VOLTAR AO TOPO
========================== */
const btnTopo = document.getElementById("btn-topo");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    btnTopo.classList.add("show");
  } else {
    btnTopo.classList.remove("show");
  }
});

// Clique para voltar suavemente
btnTopo.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

