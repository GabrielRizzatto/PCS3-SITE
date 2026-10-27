import React from "react";
import {
  ArrowRight,
  PhoneCall,
  UserX,
  Building2,
  FileWarning,
  AlertTriangle,
  Phone,
  ShieldAlert,
  HeartHandshake,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfbf7] font-sans text-gray-800">
      {}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-[#1a2e35]">
            Navegue com <br />
            <span className="text-[#e05943]">segurança</span> e <br />
            tranquilidade.
          </h1>
          <p className="text-gray-600 max-w-md">
            Aprenda a reconhecer golpes digitais e saiba o que fazer para
            proteger você e sua família.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="bg-[#e05943] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c94b37] transition">
              Conhecer os golpes <ArrowRight size={18} />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
              Preciso de ajuda agora
            </button>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1 pt-2">
            <span className="text-green-500 text-lg">✓</span> Conteúdo simples,
            gratuito e sem propagandas.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-t-full rounded-b-3xl overflow-hidden border-8 border-white shadow-xl h-[400px] w-[80%] ml-auto relative bg-gray-200">
            <Image
              src="/placeholder-casal.jpg"
              alt="Casal de idosos a usar o telemóvel"
              fill
              className="object-cover"
            />
          </div>
          {}
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs">
            <div className="bg-red-50 p-2 rounded-full text-[#e05943]">
              <HeartHandshake size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">Você não está sozinho</p>
              <p className="text-xs text-gray-500">Estamos aqui para ajudar</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GOLPES MAIS COMUNS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[#e05943] font-bold text-sm tracking-wider uppercase mb-2">
              Fique Atento
            </p>
            <h2 className="text-3xl font-bold text-[#1a2e35]">
              Os golpes mais comuns
            </h2>
            <p className="text-gray-500 mt-2">
              Conheça os sinais para identificar uma tentativa de golpe antes
              que seja tarde.
            </p>
          </div>
          <button className="text-[#e05943] font-semibold flex items-center gap-1 hover:underline">
            Ver todos os golpes <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <CardGolpe
            icon={<PhoneCall className="text-red-400" />}
            title="Falso parente"
            desc="Alguém pede dinheiro fingindo ser da família."
          />
          <CardGolpe
            icon={<UserX className="text-yellow-500" />}
            title="Clonagem de voz"
            desc="Uma voz conhecida pode ter sido criada por computador."
          />
          <CardGolpe
            icon={<Building2 className="text-blue-400" />}
            title="Falsa central bancária"
            desc="O banco nunca pede sua senha por telefone."
          />
          <CardGolpe
            icon={<FileWarning className="text-purple-400" />}
            title="Golpe do INSS"
            desc="Cuidado com mensagens e links sobre benefícios."
          />
        </div>
      </section>

      {}
      <section className="bg-[#173342] py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase">
              Sua melhor defesa
            </p>
            <h2 className="text-4xl font-bold leading-tight">
              Antes de agir, pare e confirme.
            </h2>
            <p className="text-gray-300">
              Três passos simples podem evitar a maioria dos golpes. Não tenha
              pressa: desconfiar é se proteger.
            </p>
            <button className="bg-white text-[#173342] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition">
              Aprender a regra tripla <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 space-y-6">
            <Step
              number="1"
              title="Pare"
              desc="Não clique, não pague e não passe seus dados."
            />
            <div className="border-t border-gray-100"></div>
            <Step
              number="2"
              title="Desconfie"
              desc="Urgência e ameaça são sinais comuns de golpe."
            />
            <div className="border-t border-gray-100"></div>
            <Step
              number="3"
              title="Confirme"
              desc="Ligue para a pessoa ou instituição por outro canal."
            />
          </div>
        </div>
      </section>

      {/* 4. AÇÃO RÁPIDA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-50 p-3 rounded-full text-[#e05943]">
            <AlertTriangle size={28} />
          </div>
        </div>
        <p className="text-[#e05943] font-bold text-sm tracking-wider uppercase mb-2">
          Ação Rápida e Importante
        </p>
        <h2 className="text-3xl font-bold text-[#1a2e35] mb-12">
          Caí em um golpe. E agora?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <CardAcao
            icon={<Building2 />}
            title="Fale com o seu banco"
            desc="Use somente o telefone no verso do cartão."
          />
          <CardAcao
            icon={<Phone />}
            title="Ligue 190"
            desc="Em situações de risco ou ameaça imediata."
          />
          <CardAcao
            icon={<ShieldAlert />}
            title="Disque 100"
            desc="Canal de proteção à pessoa idosa."
          />
        </div>

        <p className="text-gray-500 text-sm mt-8 flex items-center justify-center gap-2">
          <span className="text-red-400">♥</span> Respire fundo. Sentir vergonha
          é comum, mas a culpa nunca é da vítima.
        </p>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#1a2e35] text-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center gap-2 font-bold text-lg mb-4 md:mb-0">
            <ShieldAlert className="text-[#e05943]" />
            Protege 60+
          </div>
          <p className="text-gray-400">
            Este é um projeto educativo. Em emergências, ligue 190.
          </p>
        </div>
      </footer>
    </main>
  );
}

function CardGolpe({ icon, title, desc }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-xl flex items-center justify-between hover:shadow-md transition cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
        <div>
          <h3 className="font-bold text-[#1a2e35]">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
      </div>
      <ArrowRight
        size={18}
        className="text-gray-300 group-hover:text-[#e05943] transition"
      />
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-yellow-100 text-yellow-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-[#1a2e35] text-lg">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function CardAcao({ icon, title, desc }) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <div className="text-[#e05943] mb-4">{icon}</div>
      <h3 className="font-bold text-[#1a2e35] mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
