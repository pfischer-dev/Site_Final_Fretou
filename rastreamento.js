/* ===========================
   CONFIGURAÇÃO API KEY
=========================== */
const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImFjMTc4NWIxMWFjNjRjNGViYmEzNTNkYzk0YTIzNzQ5IiwiaCI6Im11cm11cjY0In0=";  // <-- Cole aqui sua key do OpenRouteService

/* ===========================
   CONFIGURAÇÃO DO MAPA
=========================== */
let mapa = L.map('mapa').setView([-23.96, -46.33], 7); // Centro mais próximo de Santos

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(mapa);

/* ===========================
   ÍCONE DO CAMINHÃO
=========================== */
const iconeCaminhao = L.icon({
  iconUrl: "img/iconTruck.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

let marcadorCaminhao = null;
let rotaLinha = null;
let trilha = null;

/* ===========================
   ÍCONES DE ORIGEM E DESTINO
=========================== */
const iconeOrigem = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

const iconeDestino = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

/* ===========================
   FUNÇÃO DE ROTA REAL
=========================== */
async function buscarRota() {
  const coordenadasOrigem = [-46.3288, -23.9535]; // Santos - SP (lon, lat)
  const coordenadasDestino = [-43.9378, -19.9208]; // Belo Horizonte - MG (lon, lat)

  try {
    const resposta = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-hgv?api_key=${API_KEY}&start=${coordenadasOrigem[0]},${coordenadasOrigem[1]}&end=${coordenadasDestino[0]},${coordenadasDestino[1]}`
    );

    const dados = await resposta.json();

    const rota = dados.features[0].geometry.coordinates;
    const propriedades = dados.features[0].properties.summary;

    desenharRota(rota);
    atualizarPainel(propriedades);
    animarCaminhao(rota);

  } catch (erro) {
    alert("❌ Erro ao consultar rota. Verifique sua API Key.");
    console.error(erro);
  }
}

/* ===========================
   DESENHAR ROTA NO MAPA
=========================== */
function desenharRota(rota) {
  const rotaConvertida = rota.map(coord => [coord[1], coord[0]]);

  if (rotaLinha) mapa.removeLayer(rotaLinha);
  rotaLinha = L.polyline(rotaConvertida, {
    color: "#007bff",
    weight: 5,
    opacity: 0.9
  }).addTo(mapa);

  mapa.fitBounds(rotaLinha.getBounds());

  // ➤ MARCADORES DE ORIGEM E DESTINO
  L.marker(rotaConvertida[0], { icon: iconeOrigem }).addTo(mapa);
  L.marker(rotaConvertida[rotaConvertida.length - 1], { icon: iconeDestino }).addTo(mapa);

}

/* ===========================
   ATUALIZAR PAINEL DE DADOS
=========================== */
function atualizarPainel(info) {
  const distanciaKm = (info.distance / 1000).toFixed(1);
  const tempoHoras = (info.duration / 3600).toFixed(1);

  document.getElementById("distancia").innerText = `${distanciaKm} km`;
  document.getElementById("tempoEstimado").innerText = `${tempoHoras} h`;
}

/* ===========================
   ANIMAÇÃO COM VELOCIDADE REAL
=========================== */
function animarCaminhao(rota) {
  const rotaConvertida = rota.map(c => [c[1], c[0]]);

  if (marcadorCaminhao) mapa.removeLayer(marcadorCaminhao);
  if (trilha) mapa.removeLayer(trilha);

  marcadorCaminhao = L.marker(rotaConvertida[0], { icon: iconeCaminhao }).addTo(mapa);
  trilha = L.polyline([rotaConvertida[0]], { color: "red", weight: 3 }).addTo(mapa);

  let i = 0;
  const velocidadeKmH = 500; // 🚚 Velocidade simulada
  const velocidadeMs = velocidadeKmH / 3.6; // m/s

  function mover() {
    if (i >= rotaConvertida.length - 1) return;

    const [latAtual, lonAtual] = rotaConvertida[i];
    const [latProx, lonProx] = rotaConvertida[i + 1];

    // Distância em metros
    const distancia = L.latLng(latAtual, lonAtual).distanceTo([latProx, lonProx]);
    const tempo = distancia / velocidadeMs * 1000; // em ms

    marcadorCaminhao.setLatLng([latProx, lonProx]);
    trilha.addLatLng([latProx, lonProx]);
    i++;

    setTimeout(mover, tempo);
  }

  mover();
}

/* ===========================
   EVENTO DO BOTÃO RASTREAR
=========================== */
document.getElementById("btnRastrear").addEventListener("click", () => {
  const codigo = document.getElementById("codigoCarga").value.trim();

  if (codigo === "") {
    alert("⚠ Digite um código para rastrear.");
    return;
  }

  buscarRota();
});