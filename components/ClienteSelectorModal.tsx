import React, { useState, useMemo } from "react";
import { ClienteIndustrial } from "../types";

interface ClienteSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: ClienteIndustrial, name: string) => void;
  currentClient?: ClienteIndustrial | "";
}

const CLIENTE_DATA = [
  {
    categoria: "Minería – Cobre y Metales",
    grupos: [
      {
        nombre: "CODELCO",
        clientes: [
          { id: "codelco_andina", nombre: "Codelco – División Andina" },
          { id: "codelco_chuquicamata", nombre: "Codelco – Chuquicamata" },
          { id: "codelco_el_teniente", nombre: "Codelco – El Teniente" },
          { id: "codelco_radomiro_tomic", nombre: "Codelco – Radomiro Tomic" },
          { id: "codelco_ministro_hales", nombre: "Codelco – Ministro Hales" },
          { id: "codelco_gabriela_mistral", nombre: "Codelco – Gabriela Mistral" },
          { id: "codelco_el_salvador", nombre: "Codelco – El Salvador" },
        ],
      },
      {
        nombre: "BHP",
        clientes: [
          { id: "bhp_escondida", nombre: "BHP – Escondida" },
          { id: "bhp_spence", nombre: "BHP – Spence" },
        ],
      },
      {
        nombre: "Antofagasta Minerals",
        clientes: [
          { id: "am_los_pelambres", nombre: "Minera Los Pelambres" },
          { id: "am_centinela", nombre: "Minera Centinela" },
          { id: "am_antucoya", nombre: "Minera Antucoya" },
          { id: "am_zaldivar", nombre: "Minera Zaldívar" },
        ],
      },
      {
        nombre: "Anglo American / Glencore",
        clientes: [
          { id: "anglo_los_bronces", nombre: "Los Bronces" },
          { id: "glencore_collahuasi", nombre: "Collahuasi" },
        ],
      },
      {
        nombre: "Freeport-McMoRan",
        clientes: [{ id: "fmi_el_abra", nombre: "Minera El Abra" }],
      },
      {
        nombre: "Lundin Mining",
        clientes: [
          { id: "lundin_candelaria", nombre: "Minera Candelaria" },
          { id: "lundin_caserones", nombre: "Minera Caserones" },
        ],
      },
      {
        nombre: "Teck",
        clientes: [
          { id: "teck_quebrada_blanca", nombre: "Quebrada Blanca (QB2)" },
          { id: "teck_carmen_andacollo", nombre: "Carmen de Andacollo" },
        ],
      },
      {
        nombre: "Capstone Copper",
        clientes: [
          { id: "capstone_mantoverde", nombre: "Mantoverde" },
          { id: "capstone_mantoblancos", nombre: "Mantos Blancos" },
        ],
      },
      {
        nombre: "Kinross",
        clientes: [{ id: "kinross_la_coipa", nombre: "La Coipa" }],
      },
      {
        nombre: "Grupo Minero Mediana Escala",
        clientes: [
          { id: "minera_carola", nombre: "Minera Carola" },
          { id: "atacama_kozan", nombre: "Atacama Kozan" },
          { id: "pucobre_punta_del_cobre", nombre: "Punta del Cobre" },
          { id: "pucobre_granate", nombre: "Granate" },
          { id: "empresa_minera_hmc", nombre: "HMC" },
          { id: "cemin", nombre: "CEMIN" },
        ],
      },
    ],
  },
  {
    categoria: "Minería – Hierro y No Metálica",
    grupos: [
      {
        nombre: "CAP Minería (CMP)",
        clientes: [
          { id: "cmp_cerro_negro_norte", nombre: "Cerro Negro Norte" },
          { id: "cmp_el_romeral", nombre: "El Romeral" },
          { id: "cmp_los_colorados", nombre: "Los Colorados" },
          { id: "cmp_los_cristales", nombre: "Mina Los Cristales" },
        ],
      },
      {
        nombre: "Otros Minerales Industriales",
        clientes: [
          { id: "sqm", nombre: "SQM (Litio y Nitratos)" },
          { id: "albemarle", nombre: "Albemarle" },
          { id: "cosayach", nombre: "Cosayach (Yodo y Salitre)" },
        ],
      },
    ],
  },
  {
    categoria: "Energía – Termoeléctricas",
    grupos: [
      {
        nombre: "Generadoras Eléctricas",
        clientes: [
          { id: "colbun", nombre: "Colbún" },
          { id: "aes_andes", nombre: "AES Andes" },
          { id: "engie", nombre: "Engie" },
          { id: "enel", nombre: "Enel" },
          { id: "guacolda", nombre: "Guacolda Energía" },
        ],
      },
    ],
  },
  {
    categoria: "Industria Forestal, Celulosa y Construcción",
    grupos: [
      {
        nombre: "Forestales y Celulosa",
        clientes: [
          { id: "arauco", nombre: "Arauco (MAPA)" },
          { id: "cmpc", nombre: "CMPC (Laja, Santa Fe, Pacífico)" },
        ],
      },
      {
        nombre: "Cemento y Cal",
        clientes: [
          { id: "cementos_bio_bio", nombre: "Cementos Bío Bío" },
          { id: "melon", nombre: "Melón" },
          { id: "polpaico", nombre: "Polpaico" },
          { id: "calera_san_antonio", nombre: "Calera San Antonio" },
          { id: "calderas_chile", nombre: "Calderas Chile" },
        ],
      },
    ],
  },
  {
    categoria: "Puertos y Terminales Graneleros",
    grupos: [
      {
        nombre: "Puertos Nacionales",
        clientes: [
          { id: "puerto_ventanas", nombre: "Puerto Ventanas" },
          { id: "puerto_angamos", nombre: "Puerto Angamos" },
          { id: "puerto_mejillones", nombre: "Puerto Mejillones" },
          { id: "puerto_totoralillo", nombre: "Puerto Punta Totoralillo" },
          { id: "tpc_coquimbo", nombre: "Terminal Puerto Coquimbo (TPC)" },
          { id: "tps_valparaiso", nombre: "TPS Valparaíso" },
          { id: "puerto_panul", nombre: "Puerto Panul" },
          { id: "puerto_patache", nombre: "Puerto Patache / Patillo" },
          { id: "puerto_coronel", nombre: "Puerto Coronel" },
        ],
      },
    ],
  },
  {
    categoria: "Otros / Manuales",
    grupos: [
      {
        nombre: "Clientes Personalizados",
        clientes: [{ id: "otro", nombre: "Otro (manual)" }],
      },
    ],
  },
];

const ClienteSelectorModal: React.FC<ClienteSelectorModalProps> = ({
  open,
  onClose,
  onSelect,
  currentClient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customName, setCustomName] = useState("");
  const [otrosPersonalizados, setOtrosPersonalizados] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return CLIENTE_DATA;
    const lowerSearch = searchTerm.toLowerCase();

    return CLIENTE_DATA.map((categoria) => ({
      ...categoria,
      grupos: categoria.grupos
        .map((grupo) => ({
          ...grupo,
          clientes: grupo.clientes.filter((cliente) =>
            cliente.nombre.toLowerCase().includes(lowerSearch)
          ),
        }))
        .filter((grupo) => grupo.clientes.length > 0),
    })).filter((categoria) => categoria.grupos.length > 0);
  }, [searchTerm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Seleccionar Cliente
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent"
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-2">
          {filteredData.map((categoria) => (
            <div key={categoria.categoria}>
              <h3 className="text-[#5e72e4] font-black text-xs uppercase tracking-[0.15em] mb-3">
                {categoria.categoria}
              </h3>

              {categoria.grupos.map((grupo) => (
                <div key={grupo.nombre} className="mb-4">
                  <h4 className="text-slate-500 text-[11px] font-bold mb-2 ml-1">
                    {grupo.nombre}
                  </h4>

                  <div className="space-y-1">
                    {grupo.clientes.map((cliente) => {
                      const isSelected = currentClient === cliente.id;
                      return (
                        <button
                          key={cliente.id}
                          type="button"
                          onClick={() => {
                            if (cliente.id === "otro") return;
                            onSelect(
                              cliente.id as ClienteIndustrial,
                              cliente.nombre
                            );
                            onClose();
                          }}
                          className={`w-full text-left text-[13px] font-semibold py-2 px-3 rounded-lg transition-all ${
                            isSelected
                              ? "bg-[#5e72e4] text-white"
                              : "hover:bg-[#f8f9fe] cursor-pointer"
                          }`}
                        >
                          {cliente.nombre}
                        </button>
                      );
                    })}

                    {/* Campo manual si selecciona “Otro (manual)” */}
                    {grupo.clientes.find((c) => c.id === "otro") && (
                      <div className="mt-3 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500">
                          Agregar cliente manualmente
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) =>
                              setCustomName(e.target.value)
                            }
                            placeholder="Escriba el nombre del cliente..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() => {
                              if (!customName.trim()) return;
                              const nuevo = customName.trim();
                              setOtrosPersonalizados([
                                ...otrosPersonalizados,
                                nuevo,
                              ]);
                              onSelect("otro" as ClienteIndustrial, nuevo);
                              setCustomName("");
                              onClose();
                            }}
                            className="bg-[#5e72e4] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#435ad8]"
                          >
                            Agregar
                          </button>
                        </div>

                        {/* Mostrar clientes personalizados agregados */}
                        {otrosPersonalizados.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[11px] text-slate-400 font-semibold mb-1">
                              Clientes agregados:
                            </p>
                            <ul className="text-[12px] text-slate-600 list-disc ml-5">
                              {otrosPersonalizados.map((n, i) => (
                                <li key={i}>{n}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No se encontraron clientes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteSelectorModal;
