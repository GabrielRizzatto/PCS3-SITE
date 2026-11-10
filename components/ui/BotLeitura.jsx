"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function BotLeitura() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [suporte, setSuporte] = useState(true);
  const pathname = usePathname();

  const rotasPermitidas = ["/", "/golpes", "/regra-tripla", "/ajuda"];
  const deveExibir = rotasPermitidas.some((rota) => pathname?.startsWith(rota));

  // Refs para controle seguro da fila de áudio sem depender de re-renders do React
  const chunksRef = useRef([]);
  const currentIndexRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const isPausedRef = useRef(false);
  const utteranceRef = useRef(null);

  // Refs para armazenar os elementos visuais e aplicar o destaque no DOM
  const nosMapeadosRef = useRef([]);
  const spanDestaqueRef = useRef(null);

  const obterVozPTBR = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes || vozes.length === 0) return null;

    return (
      vozes.find((v) => v.lang && /^(pt[-_]br)$/i.test(v.lang)) ||
      vozes.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt-br")) ||
      vozes.find(
        (v) =>
          v.name &&
          (v.name.toLowerCase().includes("brasil") ||
            v.name.toLowerCase().includes("brazil"))
      ) ||
      vozes.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt")) ||
      null
    );
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSuporte(false);
      return;
    }

    const carregarVozes = () => {
      window.speechSynthesis.getVoices();
    };

    carregarVozes();
    window.speechSynthesis.addEventListener("voiceschanged", carregarVozes);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", carregarVozes);
      pararLeitura();
    };
  }, []);

  // Para a leitura automaticamente se o usuário mudar de rota/página
  useEffect(() => {
    pararLeitura();
  }, [pathname]);

  // Remove a marcação amarela da tela e restaura a árvore DOM original
  const limparDestaque = () => {
    if (spanDestaqueRef.current) {
      const parent = spanDestaqueRef.current.parentNode;
      if (parent) {
        while (spanDestaqueRef.current.firstChild) {
          parent.insertBefore(spanDestaqueRef.current.firstChild, spanDestaqueRef.current);
        }
        parent.removeChild(spanDestaqueRef.current);
        parent.normalize(); // Reúne nós de texto divididos pelo span
      }
      spanDestaqueRef.current = null;
    }
  };

  // Aplica o destaque no bloco visual correspondente ao índice atual da leitura
  const aplicarDestaque = (index) => {
    limparDestaque();

    const noTexto = nosMapeadosRef.current[index];
    if (!noTexto || !noTexto.parentNode) return;

    try {
      const span = document.createElement("span");
      span.className = "trecho-leitura-ativo";

      noTexto.parentNode.insertBefore(span, noTexto);
      span.appendChild(noTexto);
      spanDestaqueRef.current = span;

      span.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (e) {
      console.warn("Erro ao aplicar destaque no DOM:", e);
    }
  };

  const limparSimbolos = (str) => {
    return str
      // Remove símbolos gráficos e decorativos que causam leitura estranha
      .replace(/[✓✔♥❤★☆←→↑↓▶⏸⏹►▪●•\u200B-\u200D\uFEFF]/g, "")
      // Substitui barras verticais decorativas por vírgulas para som fluido
      .replace(/\|/g, ", ")
      // Remove emojis gráficos em geral
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
  };

  const formatarTextoParaVoz = (textoBruto) => {
    if (!textoBruto) return "";

    const textoLimpo = limparSimbolos(textoBruto);
    const linhas = textoLimpo.split(/\r?\n/);
    const sentencas = [];

    for (let linha of linhas) {
      linha = linha.trim().replace(/\s+/g, " ");
      if (!linha) continue;

      // Ignora fragmentos que não contenham letras ou números
      if (!/[a-zA-Z0-9À-ÿ]/.test(linha)) continue;

      // Garante uma pontuação ao final de cada bloco de texto para
      // que o sintetizador faça uma pausa natural entre títulos e parágrafos
      const terminaComPontuacao = /[.!?:;,—–-]$/.test(linha);
      const linhaComPontuacao = terminaComPontuacao ? linha : `${linha}.`;
      sentencas.push(linhaComPontuacao);
    }

    return sentencas.join(" ");
  };

  // Divide o texto em blocos pequenos (máximo ~140 caracteres)
  // Motores móveis (Android Chrome e iOS Safari) travam ou silenciam se o texto for longo
  const dividirTextoEmChunks = (textoFormatado, maxLen = 140) => {
    if (!textoFormatado) return [];

    const sentencasBrutas =
      textoFormatado.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [textoFormatado];
    const chunks = [];

    for (let sentenca of sentencasBrutas) {
      sentenca = sentenca.trim();
      if (!sentenca) continue;

      if (sentenca.length <= maxLen) {
        chunks.push(sentenca);
      } else {
        const subPartes = sentenca.split(/([,;:]\s+)/);
        let chunkAtual = "";

        for (let i = 0; i < subPartes.length; i++) {
          const parte = subPartes[i];
          if ((chunkAtual + parte).length <= maxLen) {
            chunkAtual += parte;
          } else {
            if (chunkAtual.trim()) chunks.push(chunkAtual.trim());
            if (parte.length > maxLen) {
              const palavras = parte.split(/\s+/);
              let palavraChunk = "";
              for (const palavra of palavras) {
                if ((palavraChunk + " " + palavra).length <= maxLen) {
                  palavraChunk += (palavraChunk ? " " : "") + palavra;
                } else {
                  if (palavraChunk.trim()) chunks.push(palavraChunk.trim());
                  palavraChunk = palavra;
                }
              }
              chunkAtual = palavraChunk;
            } else {
              chunkAtual = parte;
            }
          }
        }
        if (chunkAtual.trim()) {
          chunks.push(chunkAtual.trim());
        }
      }
    }

    return chunks.filter((c) => c && c.trim().length > 0);
  };

  // --- FUNÇÃO ADAPTADA PARA SELEÇÃO DE TEXTO E MAPEAMENTO DE NÓS PARA DESTAQUE ---
  const getTextoEMapearNos = () => {
    if (typeof window === "undefined") return { chunks: [], nos: [] };

    // 1. Tenta pegar a seleção ativa do usuário com o cursor
    const selecao = window.getSelection()?.toString().trim();
    if (selecao) {
      const textoFormatado = formatarTextoParaVoz(selecao);
      const chunks = dividirTextoEmChunks(textoFormatado);
      // Ao ler seleção manual, o destaque não é aplicado nos nós do DOM para evitar conflitos com a seleção do mouse
      return { chunks, nos: [] };
    }

    // 2. Fallback: Se NADA estiver selecionado, lê o conteúdo da página mapeando os nós visíveis
    const elementoPrincipal = document.querySelector("main") || document.body;
    if (!elementoPrincipal) return { chunks: [], nos: [] };

    const seletoresParaIgnorar = [
      "button",
      "a",
      "form",
      "input",
      "textarea",
      "select",
      "option",
      "nav",
      "header",
      "footer",
      "svg",
      "img",
      "audio",
      "video",
      "iframe",
      "script",
      "style",
      "noscript",
      "[role='button']",
      "[role='link']",
      "[data-leitura-ignorar]",
      "[aria-hidden='true']",
      "[hidden]",
      ".leitura-ignorar",
    ];

    const walker = document.createTreeWalker(elementoPrincipal, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest(seletoresParaIgnorar.join(", "))) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const chunks = [];
    const nos = [];
    let noAtual;

    while ((noAtual = walker.nextNode())) {
      const textoLimpo = limparSimbolos(noAtual.textContent).trim();
      if (textoLimpo && /[a-zA-Z0-9À-ÿ]/.test(textoLimpo)) {
        const terminaComPontuacao = /[.!?:;,—–-]$/.test(textoLimpo);
        const textoFormatado = terminaComPontuacao ? textoLimpo : `${textoLimpo}.`;
        
        chunks.push(textoFormatado);
        nos.push(noAtual);
      }
    }

    return { chunks, nos };
  };

  const tocarChunk = (index) => {
    if (
      !isSpeakingRef.current ||
      isPausedRef.current ||
      index >= chunksRef.current.length
    ) {
      if (index >= chunksRef.current.length) {
        pararLeitura();
      }
      return;
    }

    currentIndexRef.current = index;
    const chunkTexto = chunksRef.current[index];
    if (!chunkTexto) {
      tocarChunk(index + 1);
      return;
    }

    // Aplica o destaque amarelado no nó visual atual
    aplicarDestaque(index);

    const utterance = new SpeechSynthesisUtterance(chunkTexto);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = "pt-BR";

    const voz = obterVozPTBR();
    if (voz) {
      utterance.voice = voz;
      utterance.lang = voz.lang;
    }

    utterance.onend = () => {
      if (isSpeakingRef.current && !isPausedRef.current) {
        // Intervalo de segurança para motores móveis (iOS/Android) processarem o próximo bloco
        setTimeout(() => {
          tocarChunk(index + 1);
        }, 30);
      }
    };

    utterance.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") {
        return;
      }
      console.warn("Aviso na leitura do bloco:", e);
      if (isSpeakingRef.current && !isPausedRef.current) {
        setTimeout(() => {
          tocarChunk(index + 1);
        }, 50);
      }
    };

    // Previne que o Garbage Collector descarte o utterance antes de terminar
    utteranceRef.current = utterance;
    if (typeof window !== "undefined") {
      window.__speechUtterance = utterance;
    }

    window.speechSynthesis.speak(utterance);
  };

  const iniciarLeitura = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Se estava pausado, retoma da exata frase onde parou
    if (isPausedRef.current && chunksRef.current.length > 0) {
      isPausedRef.current = false;
      isSpeakingRef.current = true;
      setIsPaused(false);
      setIsSpeaking(true);
      tocarChunk(currentIndexRef.current);
      return;
    }

    // Início do zero
    const { chunks, nos } = getTextoEMapearNos();
    if (chunks.length === 0) return;

    window.speechSynthesis.cancel();

    chunksRef.current = chunks;
    nosMapeadosRef.current = nos;
    currentIndexRef.current = 0;
    isPausedRef.current = false;
    isSpeakingRef.current = true;

    setIsSpeaking(true);
    setIsPaused(false);

    tocarChunk(0);
  };

  const pausarLeitura = () => {
    // Pausa controlada: interrompe o áudio atual e memoriza a frase atual
    isPausedRef.current = true;
    isSpeakingRef.current = false;
    setIsPaused(true);
    setIsSpeaking(false);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const pararLeitura = () => {
    isSpeakingRef.current = false;
    isPausedRef.current = false;
    currentIndexRef.current = 0;
    chunksRef.current = [];
    nosMapeadosRef.current = [];
    
    // Remove qualquer destaque residual da tela
    limparDestaque();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!suporte || !deveExibir) return null;

  return (
    <div
      data-leitura-ignorar="true"
      aria-hidden="true"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] border-2 border-blue-600 flex flex-col gap-2.5 sm:gap-3 z-50 w-72 max-w-[calc(100vw-2rem)]"
    >
      <p className="text-base font-bold text-center text-gray-800">
        Assistente de Leitura
      </p>
      <div className="flex gap-2">
        {!isSpeaking ? (
          <button
            onClick={iniciarLeitura}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold flex-1 text-base sm:text-lg transition-colors cursor-pointer"
            aria-label={isPaused ? "Continuar leitura" : "Ouvir o conteúdo importante da página"}
          >
            {isPaused ? "▶️ Continuar" : "▶️ Ouvir"}
          </button>
        ) : (
          <button
            onClick={pausarLeitura}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-xl font-bold flex-1 text-base sm:text-lg transition-colors cursor-pointer"
            aria-label="Pausar leitura"
          >
            ⏸️ Pausar
          </button>
        )}
        <button
          onClick={pararLeitura}
          disabled={!isSpeaking && !isPaused}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 text-white p-3 rounded-xl font-bold flex-1 text-base sm:text-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Parar leitura"
        >
          ⏹️ Parar
        </button>
      </div>
    </div>
  );
}
