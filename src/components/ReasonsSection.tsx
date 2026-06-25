/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Star, Heart, FlameKindling, EyeIcon } from 'lucide-react';
import { ReasonItem } from '../types';

export default function ReasonsSection() {
  const [activeReason, setActiveReason] = useState<ReasonItem | null>(null);

  const reasons: ReasonItem[] = [
    {
      id: 1,
      title: "Ton regard réconfortant",
      content: "Chaque fois que tes yeux profonds croisent les miens, le monde et son tumulte s'éclipsent instantanément pour laisser place à un océan de calme.",
      quoteStr: "« Ton regard est le phare qui guide mes jours. »"
    },
    {
      id: 2,
      title: "Ta douceur souveraine",
      content: "Ta tendresse infinie guérit mes doutes silencieux. Ta délicatesse me rappelle que la vie possède encore sa part de poésie divine.",
      quoteStr: "« Une caresse de tes mots adoucit toute existence. »"
    },
    {
      id: 3,
      title: "La mélodie de ton rire",
      content: "Le timbre de ta voix et la vibration cristalline de ton rire forment la plus douce symphonie qui puisse émailler mon quotidien.",
      quoteStr: "« Ton rire est un rayon de soleil en plein hiver. »"
    },
    {
      id: 4,
      title: "Ton intelligence captivante",
      content: "Changer avec toi élève mon âme. Ta façon d'analyser les mystères du monde avec sagesse et finesse me fascine chaque jour davantage.",
      quoteStr: "« Un esprit d'une clarté royale et inspirante. »"
    },
    {
      id: 5,
      title: "Ta force de caractère",
      content: "Tu traverses les épreuves de la vie avec une dignité, une résilience et un calme qui forcent mon admiration inconditionnelle.",
      quoteStr: "« Derrière ta douceur se cache une reine d'acier. »"
    },
    {
      id: 6,
      title: "Ton soutien inconditionnel",
      content: "Marcher à tes côtés me donne l'audace et la force de viser les sommets les plus vertigineux. Tu es ma plus belle alliée.",
      quoteStr: "« Avec toi, chaque horizon devient abordable. »"
    },
    {
      id:7,
      title: "Ta lumière intérieure",
      content: "Tu as cette capacité fabuleuse d'apporter de la beauté et de la clarté partout où tu passes, sublimant mon quotidien.",
      quoteStr: "« Tu es une étoile éveillée sur mon chemin. »"
    },
    {
      id: 8,
      title: "Ta façon de me comprendre",
      content: "Tu sais lire entre les lignes de mes silences, apaisant mes pensées les plus secrètes avant même que je n'aie à exprimer mes maux.",
      quoteStr: "« Une complicité silencieuse d'une pureté rare. »"
    },
    {
      id: 9,
      title: "Ton élégance intemporelle",
      content: "Ta grâce va bien au-delà de ton incomparable beauté physique ; elle émane d'une noblesse innée et d'une douce fierté.",
      quoteStr: "« La grâce réside dans ton maintien divin. »"
    },
    {
      id: 10,
      title: "Ta bienveillance sacrée",
      content: "Ton cœur est d'or massif. La sollicitude désintéressée dont tu fais preuve envers les tiens m'inspire à devenir un homme meilleur.",
      quoteStr: "« Ton cœur est un repaire d'amour et de paix. »"
    },
    {
      id: 11,
      title: "Le parfum de ta peau",
      content: "Cet effluve rassurant et singulier qui t'accompagne est le remède absolu qui rend mes soirées sereines au moindre rapprochement.",
      quoteStr: "« Ton odeur est le cocon de mon sommeil. »"
    },
    {
      id: 12,
      title: "Ta patience d'ange",
      content: "Tu sais accueillir mes imperfections, mes élans et mon immaturité avec une patience divine, m'aidant à grandir sans me juger.",
      quoteStr: "« La sagesse d'un être qui sait aimer sans limites. »"
    },
    {
      id: 13,
      title: "Le refuge de tes bras",
      content: "Me blottir contre ton épaule me donne le sentiment d'être à l'abri de tous les séismes et tempêtes que le monde extérieur peut générer.",
      quoteStr: "« Tes bras sont mon unique havre de paix. »"
    },
    {
      id: 14,
      title: "La pureté de ta loyauté",
      content: "Ton engagement et ta droiture dans notre relation sont des fondations sacrées de confiance qui me permettent d'avancer les yeux fermés.",
      quoteStr: "« Ton dévouement est le ciment de nos liens. »"
    },
    {
      id: 15,
      title: "Nos moments de simplicité",
      content: "Partager une marche, écouter notre playlist préférée dans la pénombre, rire de rien... Ces instants humbles sont mes plus grands trophées.",
      quoteStr: "« Le bonheur s'est blotti dans notre routine dorée. »"
    },
    {
      id: 16,
      title: "La liberté d'être moi-même",
      content: "À tes côtés, pas de fards ni d'artifices. Tu aimes mes failles et mes folies, me permettant d'être entièrement authentique en ta présence.",
      quoteStr: "« Être aimé tel que l'on est est le plus grand luxe. »"
    },
    {
      id: 17,
      title: "Ta sensibilité artistique",
      content: "Ta manière de percevoir les détails poétiques, que ce soit une fleur, un vêtement, ou un paysage, témoigne de la haute finesse de ton âme.",
      quoteStr: "« Tu vois la beauté cachée sous chaque pierre. »"
    },
    {
      id: 18,
      title: "Ton sourire au petit matin",
      content: "Te voir baignée par les lueurs dorées de l'aube, sereine et paisible, est la raison pour laquelle je rends grâce au destin chaque lever.",
      quoteStr: "« Le matin s'éveille lorsque s'ouvrent tes grands yeux. »"
    },
    {
      id: 19,
      title: "L'harmonie que nous formons",
      content: "La fusion naturelle de nos sensibilités et de nos caractères. Nous nous complétons d'une manière si fluide qu'elle semble écrite par le ciel.",
      quoteStr: "« Deux âmes amies faites pour s'accorder. »"
    },
    {
      id: 20,
      title: "Le futur que nous écrivons",
      content: "Parce que t'aimer est l'évidence la plus éclatante de mon existence, le voyage le plus beau, et l'engagement le plus sacré de toute ma vie.",
      quoteStr: "« T'aimer est l'aboutissement de toutes mes quêtes. »"
    }
  ];

  // Helper to convert index to Roman Numerals (I to XX)
  const romanNumerals = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
  ];

  return (
    <section
      id="printemps-raisons-de-taimer"
      className="relative min-h-screen bg-[#0A0502] py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-[#C5A059]/15 selection:bg-[#C5A059]/15"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,165,165,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col items-center gap-16 relative z-10">
        
        {/* Glamour Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-[#C5A059] text-xs font-display tracking-[0.4em] uppercase"
          >
            <FlameKindling className="w-3.5 h-3.5" />
            <span>Chant du Nouveau Printemps</span>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#F7E7CE] tracking-wide">
            Nouveau Printemps de Raisons de T'aimer
          </h2>
          
          <p className="font-sans font-light sm:max-w-xl mx-auto text-[#E6D5B8]/80 italic text-sm md:text-base leading-relaxed">
            « De doux battements secrets de mon cœur, transcrits en lettres d’or pour accueillir ton Nouveau Printemps et ma dévotion... »
          </p>
        </div>

        {/* 20 compact luxury gold badge grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4 w-full justify-center">
          {reasons.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03, duration: 0.5 }}
              whileHover={{ scale: 1.15, borderColor: 'rgba(197, 160, 89, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveReason(item)}
              className="h-14 sm:h-16 rounded-xl border border-[#C5A059]/15 bg-[#151312]/95 text-[#E6D5B8] font-serif font-medium tracking-wide text-sm sm:text-base flex items-center justify-center cursor-pointer shadow-md duration-300 transition-all select-none hover:bg-[#C5A059]/10"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#C5A059] font-display font-light mb-0.5 tracking-tighter">RAISON</span>
                <span className="text-[#F7E7CE]">{romanNumerals[idx]}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Dynamic Display area for current selected card instructions */}
        <div className="min-h-[140px] flex items-center justify-center w-full max-w-2xl text-center">
          <AnimatePresence mode="wait">
            {!activeReason ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="font-serif text-sm text-stone-500 tracking-widest italic"
              >
                [ Sélectionnez un nombre romain pour révéler une raison céleste ]
              </motion.div>
            ) : (
              <motion.div
                key={activeReason.id}
                initial={{ opacity: 0, y: 15, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(3px)' }}
                transition={{ duration: 0.4 }}
                className="glass-gold px-8 py-10 rounded-2xl w-full border border-[#C5A059]/20 shadow-xl space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3  rounded-full border border-[#C5A059]/30 text-[10px] text-[#C5A059] font-display font-bold uppercase tracking-widest bg-[#0A0502]/60">
                  <Star className="w-2.5 h-2.5 fill-[#C5A059] text-[#C5A059]" />
                  Raison {romanNumerals[activeReason.id - 1]}
                </div>
                
                <h3 className="font-serif text-2xl text-[#F7E7CE] tracking-wide font-light">
                  {activeReason.title}
                </h3>
                
                <p className="font-sans text-[#E6D5B8] leading-relaxed font-light text-sm md:text-base italic">
                  « {activeReason.content} »
                </p>

                <div className="w-8 h-[1px] bg-[#C5A059]/20 mx-auto pt-2" />
                
                <p className="font-serif text-xs text-[#D4A5A5] italic tracking-wider uppercase">
                  {activeReason.quoteStr}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
