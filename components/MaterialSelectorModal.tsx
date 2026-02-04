import React, { useState, useMemo, useEffect } from "react";
import { TipoMaterial } from "../types";

interface MaterialSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string, nombre: string) => void;
  currentMaterial?: string;
}

const MATERIAL_DATA = [
  {
    categoria: "Minerales Metálicos",
    materiales: [
      { id: "mineral_metalico_rom", nombre: "Minerales Metálicos (ROM, concentrados y productos intermedios)" },
      { id: "mineral_cobre_rom", nombre: "Mineral de Cobre (ROM / Crudo)" },
      { id: "concentrado_cobre", nombre: "Concentrado de Cobre" },
      { id: "mineral_cobre_sulfurado", nombre: "Mineral de Cobre Sulfurado" },
      { id: "mineral_cobre_oxidado", nombre: "Mineral de Cobre Oxidado" },
      { id: "ripios_lixiviacion", nombre: "Ripios de Lixiviación" },
      { id: "mineral_oro_rom", nombre: "Mineral de Oro (ROM)" },
      { id: "concentrado_oro", nombre: "Concentrado de Oro" },
      { id: "relave_oro", nombre: "Relave de Oro" },
      { id: "mineral_plata", nombre: "Mineral de Plata" },
      { id: "mineral_zinc", nombre: "Mineral de Zinc" },
      { id: "mineral_plomo", nombre: "Mineral de Plomo" },
      { id: "mineral_molibdeno", nombre: "Mineral de Molibdeno" },
      { id: "mineral_hierro", nombre: "Mineral de Hierro" },
      { id: "concentrado_hierro", nombre: "Concentrado de Hierro" },
      { id: "pellets_hierro", nombre: "Pellets de Hierro" },
      { id: "finos_hierro", nombre: "Finos de Hierro" },
      { id: "sinter_feed", nombre: "Sinter Feed" },
      { id: "mineral_manganeso", nombre: "Mineral de Manganeso" },
      { id: "mineral_niquel", nombre: "Mineral de Níquel" },
      { id: "mineral_polimetalico", nombre: "Mineral Polimetálico" },
    ],
  },
  {
    categoria: "Minerales Energéticos",
    materiales: [
      { id: "carbon_termico", nombre: "Carbón Térmico" },
      { id: "carbon_metalurgico", nombre: "Carbón Metalúrgico" },
      { id: "carbon_pulverizado", nombre: "Carbón Pulverizado" },
      { id: "coque", nombre: "Coque" },
      { id: "petcoke", nombre: "Petcoke" },
      { id: "biomasa_general", nombre: "Biomasa Industrial (general)" },
      { id: "biomasa_forestal", nombre: "Biomasa Forestal" },
      { id: "astillas_madera", nombre: "Astillas de Madera" },
      { id: "chips_madera", nombre: "Chips de Madera" },
      { id: "bagazo", nombre: "Bagazo" },
      { id: "rdf_srf", nombre: "Residuos Orgánicos Secos (RDF/SRF)" },
    ],
  },
  {
    categoria: "Minerales No Metálicos / Construcción",
    materiales: [
      { id: "caliza", nombre: "Caliza" },
      { id: "caliza_triturada", nombre: "Caliza Triturada" },
      { id: "cal_viva", nombre: "Cal Viva" },
      { id: "cal_hidratada", nombre: "Cal Hidratada" },
      { id: "dolomita", nombre: "Dolomita" },
      { id: "yeso", nombre: "Yeso" },
      { id: "caolin", nombre: "Caolín" },
      { id: "feldespato", nombre: "Feldespato" },
      { id: "arena_silicea", nombre: "Arena Silícea" },
      { id: "grava", nombre: "Grava" },
      { id: "agregados", nombre: "Áridos / Agregados" },
      { id: "hormigon_seco", nombre: "Hormig\u00f3n Seco (premezcla)" },
      { id: "bentonita", nombre: "Bentonita" },
      { id: "baritina", nombre: "Baritina" },
    ],
  },
  {
    categoria: "Cemento y Procesos Industriales",
    materiales: [
      { id: "clinker_cemento", nombre: "Clinker de Cemento" },
      { id: "crudo_cemento", nombre: "Crudo de Cemento (Raw Meal)" },
      { id: "cemento_portland", nombre: "Cemento Portland" },
      { id: "polvo_cemento", nombre: "Polvo de Cemento" },
      { id: "harina_cruda", nombre: "Harina Cruda" },
      { id: "material_bypass", nombre: "Material de Retorno (Bypass)" },
      { id: "ckd", nombre: "Polvos de Filtro / CKD" },
      { id: "escoria_alto_horno", nombre: "Escoria de Alto Horno" },
      { id: "escoria_granulada", nombre: "Escoria Granulada" },
    ],
  },
  {
    categoria: "Sales, Litio y Químicos Sólidos",
    materiales: [
      { id: "sal_gruesa", nombre: "Sal Gruesa" },
      { id: "sal_fina", nombre: "Sal Fina" },
      { id: "sal_industrial", nombre: "Sal Industrial" },
      { id: "cloruro_sodio", nombre: "Cloruro de Sodio" },
      { id: "nitrato_sodio", nombre: "Nitrato de Sodio" },
      { id: "sulfato_sodio", nombre: "Sulfato de Sodio" },
      { id: "carbonato_litio", nombre: "Carbonato de Litio" },
      { id: "hidroxido_litio", nombre: "Hidróxido de Litio" },
      { id: "sales_litio", nombre: "Sales de Litio (generales)" },
      { id: "boratos", nombre: "Boratos" },
      { id: "sulfatos", nombre: "Sulfatos" },
      { id: "fertilizantes_granulados", nombre: "Fertilizantes Granulados" },
      { id: "fertilizantes_polvo", nombre: "Fertilizantes en Polvo" },
    ],
  },
  {
    categoria: "Relaves, Residuos y Subproductos",
    materiales: [
      { id: "relave_cobre", nombre: "Relave de Cobre" },
      { id: "relave_oro", nombre: "Relave de Oro" },
      { id: "relave_espesado", nombre: "Relave Espesado" },
      { id: "relave_filtrado", nombre: "Relave Filtrado" },
      { id: "polvos_industriales", nombre: "Polvos Industriales" },
      { id: "cenizas_volantes", nombre: "Cenizas Volantes" },
      { id: "cenizas_fondo", nombre: "Cenizas de Fondo" },
      { id: "escorias", nombre: "Escorias" },
      { id: "residuos_mineros_secos", nombre: "Residuos Mineros Secos" },
      { id: "residuos_industriales", nombre: "Residuos Industriales Sólidos" },
    ],
  },
  {
    categoria: "Graneles y Logística Portuaria",
    materiales: [
      { id: "concentrado_generico", nombre: "Concentrado Mineral (genérico)" },
      { id: "granel_mineral", nombre: "Granel Sólido Mineral" },
      { id: "granel_industrial", nombre: "Granel Industrial" },
      { id: "granel_abrasivo", nombre: "Granel Abrasivo" },
      { id: "granel_humedo", nombre: "Granel Húmedo" },
      { id: "granel_seco", nombre: "Granel Seco" },
      { id: "stockpile", nombre: "Stockpile Material" },
      { id: "transferencia_portuaria", nombre: "Material de Transferencia Portuaria" },
    ],
  },
  {
    categoria: "Otros",
    materiales: [
      { id: "material_mixto", nombre: "Material Mixto" },
      { id: "material_abrasivo_especial", nombre: "Material Abrasivo Especial" },
      { id: "material_pegajoso", nombre: "Material Pegajoso" },
      { id: "material_humedo", nombre: "Material Húmedo" },
      { id: "otro", nombre: "Otro (según CEMA 550)" },
    ],
  },
];

const MaterialSelectorModal: React.FC<MaterialSelectorModalProps> = ({
  open,
  onClose,
  onSelect,
  currentMaterial,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");
  const [otrosMateriales, setOtrosMateriales] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("otrosMateriales");
    if (saved) {
      setOtrosMateriales(JSON.parse(saved));
    }
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return MATERIAL_DATA;
    const lowerSearch = searchTerm.toLowerCase();

    return MATERIAL_DATA.map((categoria) => ({
      ...categoria,
      materiales: categoria.materiales.filter((material) =>
        material.nombre.toLowerCase().includes(lowerSearch)
      ),
    })).filter((categoria) => categoria.materiales.length > 0);
  }, [searchTerm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Seleccionar Material
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
            placeholder="Buscar material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {filteredData.map((categoria) => (
            <div key={categoria.categoria}>
              <h3 className="text-[#5e72e4] font-black text-xs uppercase tracking-[0.15em] mb-3">
                {categoria.categoria}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {categoria.materiales.map((material) => {
                  const isSelected = currentMaterial === material.nombre;
                  return (
                    <div key={material.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (material.id === "otro") {
                            return; // Handle "otro" separately with input
                          }
                          onSelect(material.id, material.nombre);
                          onClose();
                        }}
                        className={`w-full text-left text-[13px] font-semibold py-2 px-3 rounded-lg transition-all ${
                          isSelected
                            ? "bg-[#5e72e4] text-white"
                            : "hover:bg-[#f8f9fe] cursor-pointer text-[#32325d]"
                        }${
                          material.id === "otro" ? " bg-[#5e72e4] text-white" : ""
                        }`}
                      >
                        {material.nombre}
                      </button>
                      {material.id === "otro" && (
                        <div className="mt-3 space-y-2">
                          <label className="text-[11px] font-bold text-slate-500">
                            Agregar material manualmente
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customMaterial}
                              onChange={(e) => setCustomMaterial(e.target.value)}
                              placeholder="Escriba el material conforme a la clasificación CEMA 550..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
                            />
                            <button
                              onClick={() => {
                                if (!customMaterial.trim()) return;
                                const nuevo = customMaterial.trim();
                                const nuevos = [...otrosMateriales, nuevo];
                                setOtrosMateriales(nuevos);
                                localStorage.setItem("otrosMateriales", JSON.stringify(nuevos));
                                onSelect("otro", nuevo);
                                setCustomMaterial("");
                                onClose();
                              }}
                              className="bg-[#5e72e4] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#435ad8] transition-colors"
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No se encontraron materiales
            </div>
          )}

          {otrosMateriales.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-[#5e72e4] font-black text-xs uppercase tracking-[0.15em] mb-3">
                Materiales Personalizados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {otrosMateriales.map((nombre, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelect("otro", nombre);
                      onClose();
                    }}
                    className="w-full text-left text-[13px] font-semibold py-2 px-3 rounded-lg transition-all hover:bg-[#f8f9fe] cursor-pointer text-[#32325d]"
                  >
                    {nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialSelectorModal;
