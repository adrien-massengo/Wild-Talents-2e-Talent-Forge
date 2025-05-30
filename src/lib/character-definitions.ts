
// src/lib/character-definitions.ts

export interface ArchetypeDefinition {
  id: string;
  name: string; // Includes points, e.g., "Adept (5 Points)"
  points: number;
  sourceText: string;
  permissionText: string;
  description: string;
  intrinsicsText?: string;
  additions?: string;
  mandatoryPowerText?: string;
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: 'custom',
    name: 'Custom Archetype',
    points: 0,
    sourceText: 'N/A',
    permissionText: 'N/A',
    description: 'You are building a custom archetype. Select Meta-Qualities below. The first positive-cost Source Meta-Quality is free.',
  },
  {
    id: 'adept',
    name: 'Adept (5 Points)',
    points: 5,
    sourceText: 'Source: Life Force',
    permissionText: 'Permission: Hypertrained',
    description: 'Your tireless study of some esoteric practice has allowed you to transcend the limitations of the human condition. By channeling your life force you have attained superhuman mastery of otherwise ordinary human abilities, allowing you to buy any number of Hyperskills and maintain a Willpower score.',
  },
  {
    id: 'alien',
    name: 'Alien (5 Points)',
    points: 5,
    sourceText: 'Source: Extraterrestrial/Extradimensional',
    permissionText: 'Permission: Power Theme',
    description: 'You are not of the Earth. Whether you are from an alternate dimension, another planet, or a paranormal continuum, you’re just not human. In this most basic form, you are assumed to be humanoid and your hit locations and wound boxes are assigned just like a normal human. If you wish to be completely alien, purchase the Custom Stats or Globular Meta-Qualities.',
  },
  {
    id: 'anachronist',
    name: 'Anachronist (20 Points)',
    points: 20,
    sourceText: 'Source: Genetic, Life Force, Paranormal, Technological, or Extradimensional/Extraterrestrial (pick one)',
    permissionText: 'Permission: Inventor',
    intrinsicsText: 'Intrinsic: Mutable',
    description: 'You are an inventor: one part Einstein’s brilliance, one part Tesla’s innovation, with a dash of Edison’s persistence for flavor. In your laboratory you construct devices that beggar the imagination of the world’s most accomplished scientific minds. Whether your creations are mystical or scientific in nature, they transcend what is considered the extent of human ability.',
  },
  {
    id: 'artificial',
    name: 'Artificial (12 Points)',
    points: 12,
    sourceText: 'Source: Construct',
    permissionText: 'Permission: Super',
    intrinsicsText: 'Intrinsics: No Base Will, Mutable, Unhealing',
    description: 'You are not natural. Someone or something made you. Artificials are usually made in imitation of their creator’s race; you are assumed to be humanoid and your hit locations and wound boxes are those of a normal human, but when damaged you must be repaired rather than healing naturally.',
  },
  {
    id: 'godlike_talent',
    name: 'Godlike Talent (0 Points)',
    points: 0,
    sourceText: 'Source: Psi',
    permissionText: 'Permission: Super',
    intrinsicsText: 'Intrinsics: Mandatory Power, Willpower Contest, No Willpower No Way',
    mandatoryPowerText: 'Perceive Godlike Talents 2hd (U; Flaw: See It First –1; costs 4 Points)',
    description: 'Talents from Godlike are humans with the peculiar ability to change reality with the power of their minds alone. They possess several unique abilities and limitations—such as the ability to detect and resist the powers of others of their kind. There is no physiological aspect to the phenomena; they are wholly psychic in nature. In Godlike, Talents are usually built on 25 Points with normal Stats and Skills provided free. Using Wild Talents rules such characters are built on 125 Points.',
    additions: 'For postwar Wild Talents in the Godlike world, build them normally without this Archetype. You can pick or create any other Archetype you like; they have transcended the limitations of their predecessors and are now truly superhuman.',
  },
  {
    id: 'godling',
    name: 'Godling (20 Points)',
    points: 20,
    sourceText: 'Sources: Divine, Paranormal',
    permissionText: 'Permissions: Super',
    description: 'You’re not the God, but a god, surely; or perhaps you are related to a divine entity of some sort and have been exiled to spend your unnaturally long life in the mortal realm.',
  },
  {
    id: 'human_plus',
    name: 'Human+ (15 Points)',
    points: 15,
    sourceText: 'Source: Genetic, Psi or Technological',
    permissionText: 'Permission: Super',
    description: 'You’re a human modified by science, or something else, to be something more. Whatever experiment or accident befell you, it granted you powers beyond the rank and file of humanity.',
  },
  {
    id: 'mutant',
    name: 'Mutant (5 Points)',
    points: 5,
    sourceText: 'Source: Genetic',
    permissionText: 'Permission: Power Theme',
    description: 'You’re the next phase of evolution. Due to some sort of radiation-induced or genetic mutation, you are physiologically different from normal members of your species.',
  },
  {
    id: 'mystic',
    name: 'Mystic (21 Points)',
    points: 21,
    sourceText: 'Source: Paranormal',
    permissionText: 'Permissions: One Power (Cosmic Power), Inventor',
    intrinsicsText: 'Intrinsic: Mutable',
    description: 'You have discovered the secrets of magic. With your exceptional Willpower you focus mystical energies to create numerous superhuman effects and create magical items. (Your powers take a supernatural, magical form; instead of traditional Cosmic Power and Gadgeteering, you practice spellcasting and enchant objects.)',
  },
  {
    id: 'super_normal',
    name: 'Super-Normal (5 Points)',
    points: 5,
    sourceText: 'Source: Driven',
    permissionText: 'Permission: Peak Performer',
    description: 'You’re an exceptional member of your species, so exceptional you’re considered superhuman by the rank and file of your native population.',
  },
];

export interface MetaQualityBase {
  id: string;
  name: string; // Full name e.g., "Source: Conduit (5 Points)"
  label: string; // Short name e.g., "Conduit"
  points: number | ((config: any) => number);
  description?: string;
}

export interface SourceMetaQuality extends MetaQualityBase {}
export const SOURCE_META_QUALITIES: SourceMetaQuality[] = [
  { id: 'conduit', name: 'Source: Conduit (5 Points)', label: 'Conduit', points: 5, description: 'You’re a gateway to an extradimensional source of energy, and your powers are a careful application of that force.' },
  { id: 'construct_source', name: 'Source: Construct (5 Points)', label: 'Construct', points: 5, description: 'You’re an artificial entity created by magic or super-science, and your powers derive from your artificial nature.' },
  { id: 'cyborg', name: 'Source: Cyborg (5 Points)', label: 'Cyborg', points: 5, description: 'You’re part human, part machine. Your machine components are housed in any hit locations on your body, and can be built as foci—see page 134 for details. Choose those locations at character creation. You still require a Permission Meta-Quality to determine what powers your cyborg components can possess.' },
  { id: 'divine', name: 'Source: Divine (5 Points)', label: 'Divine', points: 5, description: 'Your powers are derived from a deity or deities, or through your divine nature.' },
  { id: 'driven', name: 'Source: Driven (5 Points)', label: 'Driven', points: 5, description: 'Your inhuman drive has pushed you past the bounds of human potential.' },
  { id: 'extraterrestrial_extradimensional', name: 'Source: Extraterrestrial/Extradimensional (5 Points)', label: 'Extraterrestrial/Extradimensional', points: 5, description: 'You’re from another planet or dimension and your powers are derived from your alien nature.' },
  { id: 'genetic_source', name: 'Source: Genetic (5 Points)', label: 'Genetic', points: 5, description: 'Your powers are a result of genetic enhancement.' },
  { id: 'life_force', name: 'Source: Life Force (5 Points)', label: 'Life Force', points: 5, description: 'Your abilities are based upon the manipulation of your life force—the secret power all living beings possess.' },
  { id: 'paranormal_source', name: 'Source: Paranormal (5 Points)', label: 'Paranormal', points: 5, description: 'Your powers are magical in nature.' },
  { id: 'power_focus', name: 'Source: Power Focus (–8 Points)', label: 'Power Focus', points: -8, description: 'All your powers are embedded in a single unique focus (see page 134) or must be channeled through one to work properly. If that focus is destroyed, your powers are unusable and return only at the GM’s discretion—if ever. You still need a Permission Meta-Quality to determine what powers your focus can possess.' },
  { id: 'psi_source', name: 'Source: Psi (5 Points)', label: 'Psi', points: 5, description: 'Your powers are psionic: You manipulate the world through the power of your mind.' },
  { id: 'technological', name: 'Source: Technological (5 Points)', label: 'Technological', points: 5, description: 'Your powers come from advanced technology. Either you wield high-tech gadgets or you’re the product of super-science.' },
  { id: 'unknown_source', name: 'Source: Unknown (–5 Points)', label: 'Unknown', points: -5, description: 'Your Source is a mystery. Your powers are just as baffling to you as they are to others.' },
];

export interface PermissionMetaQuality extends MetaQualityBase {}
export const PERMISSION_META_QUALITIES: PermissionMetaQuality[] = [
  { id: 'hypertrained', name: 'Permission: Hypertrained (5 Points)', label: 'Hypertrained', points: 5, description: 'You can purchase any number of Hyperskills and any kind of dice with them.' },
  { id: 'inhuman_stats', name: 'Permission: Inhuman Stats (1+ Points)', label: 'Inhuman Stats', points: 1, description: 'Characters with this Permission have limits on Stats that are different from the ordinary limits. Where humans are limited to five dice in a Stat (not counting Hyperstat dice; see page 104), your Archetype might have more, perhaps even in more than one Stat. In addition, the maximum allowed Stat sets the maximum allowed Skill for all Skills based on that Stat. This Permission costs 3 Points for each inhuman Stat. That Stat, and all Skills based on it, can have up to 10d rather than the normal 5d limit, and can have Hard Dice, Wiggle Dice, additional Power Qualities, Power Quality Levels, Extras and Flaws. The inhuman Stat is not affected if your Willpower reaches zero, like a typical Hyperstat would be. For each Stat that has a maximum lower than five, subtract 1 Point from the cost of this Permission per die lower than five. This also restricts your maximum dice with Skills associated with the restricted Stat. The Permission has a minimum cost of 1 Point.' },
  { id: 'inventor', name: 'Permission: Inventor (5 Points)', label: 'Inventor', points: 5, description: 'You can build external powers of any type embedded in foci, also known as gadgets (when based on high technology) or artifacts (when based on magic). You may buy any number of dice in the Gadgeteering power (see page 145), but all other powers must be built into foci. You cannot take any other permanent, internal power without buying another Permission.' },
  { id: 'one_power', name: 'Permission: One Power (1 Point)', label: 'One Power', points: 1, description: 'You can have any one Hyperstat, Hyperskill, or Miracle—but only one. (This can still be pretty broad with a “Variable Effect” Miracle such as Cosmic Power, page 142.)' },
  { id: 'peak_performer', name: 'Permission: Peak Performer (5 Points)', label: 'Peak Performer', points: 5, description: 'You may purchase any kind of dice with your Stats and Skills, up to the normal limit of five dice in a Stat or Skill unless you have Inhuman Stats. You can have 5wd in Body, for example, or 5hd in Coordination and 5wd in Body, but not 6d in either one.' },
  { id: 'power_theme', name: 'Permission: Power Theme (5 Points)', label: 'Power Theme', points: 5, description: 'You can buy Hyperstats, Hyperskills, and Miracles, but all powers must fit a certain theme, such as “cold-based powers,” “solar powers,” “monkey powers,” or whatever you and the GM agree on.' },
  { id: 'prime_specimen', name: 'Permission: Prime Specimen (5 Points)', label: 'Prime Specimen', points: 5, description: 'You can buy Hyperstats without restriction.' },
  { id: 'super_permission', name: 'Permission: Super (15 Points)', label: 'Super', points: 15, description: 'You can purchase any number and types of dice with Hyperstats, Hyperskills, and powers.' },
  { id: 'super_equipment', name: 'Permission: Super-Equipment (2 Points)', label: 'Super-Equipment', points: 2, description: 'During character creation only, you can buy any number of powers embedded in foci. This Permission does not give you the ability to buy internal powers or the Gadgeteering Miracle; it only allows you to buy gadgets or artifacts during character creation. To get a new one after character creation you must have the GM’s permission.' },
];

export interface AllergyOption { value: string; label: string; }
export const ALLERGY_SUBSTANCES: AllergyOption[] = [
  { value: 'common', label: 'Common' },
  { value: 'frequent', label: 'Frequent' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
];
export const ALLERGY_EFFECTS: AllergyOption[] = [
  { value: 'incapacitates', label: 'Incapacitates' },
  { value: 'kills', label: 'Kills' },
  { value: 'drains_willpower', label: 'Drains Willpower' },
];
export type AllergySubstanceType = typeof ALLERGY_SUBSTANCES[number]['value'];
export type AllergyEffectType = typeof ALLERGY_EFFECTS[number]['value'];

export interface IntrinsicMetaQuality extends MetaQualityBase {
  configKey?: 'allergyConfig' | 'bruteFrailConfig' | 'customStatsConfig' | 'mandatoryPowerConfig' | 'vulnerableConfig';
  customStatsDiscardOptions?: Array<{ value: string; label: string; description: string }>;
}

export function calculateAllergyPoints(substance?: AllergySubstanceType, effect?: AllergyEffectType): number {
  if (!substance || !effect) return 0;
  if (substance === 'common') {
    if (effect === 'incapacitates') return -4;
    if (effect === 'kills') return -8;
    if (effect === 'drains_willpower') return -16;
  }
  if (substance === 'frequent') {
    if (effect === 'incapacitates') return -3;
    if (effect === 'kills') return -6;
    if (effect === 'drains_willpower') return -12;
  }
  if (substance === 'uncommon') {
    if (effect === 'incapacitates') return -2;
    if (effect === 'kills') return -4;
    if (effect === 'drains_willpower') return -8;
  }
  if (substance === 'rare') {
    if (effect === 'incapacitates') return -1;
    if (effect === 'kills') return -2;
    if (effect === 'drains_willpower') return -4;
  }
  return 0;
}

export const INTRINSIC_META_QUALITIES: IntrinsicMetaQuality[] = [
  {
    id: 'allergy', name: 'Intrinsic: Allergy (variable cost)', label: 'Allergy',
    points: (config: any) => calculateAllergyPoints(config?.substance, config?.effect),
    description: 'You’re allergic to a substance. Exposure to it is enough to drain Willpower, incapacitate or even kill you.',
    configKey: 'allergyConfig',
  },
  {
    id: 'brute_frail', name: 'Intrinsic: Brute/Frail (–8 Points)', label: 'Brute/Frail', points: -8,
    description: 'All your physical actions (including powers) are limited to a maximum width of 2 for initiative purposes only (this does not affect damage or other functions of width). This represents either overwhelming physical power (which makes it difficult to focus on small or swift targets), or a natural frailty that makes it difficult to move too fast. Pick one.',
    configKey: 'bruteFrailConfig',
  },
  {
    id: 'custom_stats', name: 'Intrinsic: Custom Stats (5 Points)', label: 'Custom Stats', points: 5,
    description: 'Select an attribute to discard. Its box\'s contents will be replaced with specific effects.',
    configKey: 'customStatsConfig',
    customStatsDiscardOptions: [
      { value: 'body', label: 'Body', description: 'You are immaterial and can’t interact with the physical world in any way. This includes any powers you possess—even non-physical ones. To interact with the world, you must purchase a Miracle such as Alternate Forms or Sidekick that has a Body Stat. All Body rolls made against you must be made against your Alternate Forms or Sidekick dice pool.' },
      { value: 'coordination', label: 'Coordination', description: 'You are completely motionless; you can’t move unless you purchase a power to transport you or have a buddy to carry you around.' },
      { value: 'sense', label: 'Sense', description: 'You are completely oblivious to the world and can’t react to any stimulus. Unless you purchase a power that senses the world you are deaf, dumb, and blind.' },
      { value: 'command', label: 'Command', description: 'You are immune to emotional stimulus, and you have trouble understanding the very concepts of human authority and leadership. The notions of “leader” and “follower”—not to mention “government” and “law”—are completely lost on you. You can’t comprehend imperatives, only declarations; the statement “You should go left now to avoid getting stepped on by Doc Saturn” makes sense; the instruction “Go left!” leaves you baffled. On the upside, you are completely immune to the effects of failed Trauma Checks.' },
      { value: 'charm', label: 'Charm', description: 'You cannot fathom the concept of emotions. Because nothing has emotional content or context, you cannot interact with any other characters on anything more than a purely fact-based level. You are completely immune to emotional stimulus and are incapable of following even the simplest emotional cues. You might open fire on a six-year-old child because “it bared its teeth in a threatening manner.”' },
    ]
  },
  {
    id: 'globular', name: 'Intrinsic: Globular (8 Points)', label: 'Globular', points: 8,
    description: 'You are an amorphous, constantly changing life form. All 34 of your wound boxes are contained in a single hit location (1-10), but you must mark four wound boxes on your character sheet as brain boxes. If these boxes are filled with Shock damage, you are knocked unconscious. If they fill with Killing, you die. Any of your brain boxes can “split off” from your body, abandoning it in case of gross physical damage (only one can do so; the rest die along with the body). If this is done, you lose all Willpower points except 1. You then can heal your hit boxes back normally, up to your normal level, as per the healing rules on page 61. This Intrinsic does not give you the ability to do more than one thing at a time, or to heal yourself instantly by rearranging your body. If you want to be able to use multiple pseudopods at once, buy the Multiple Actions Miracle; if you want to regenerate, buy Regeneration.',
  },
  {
    id: 'inhuman_intrinsic', name: 'Intrinsic: Inhuman (–8 Points)', label: 'Inhuman', points: -8,
    description: 'You’re terrifyingly inhuman, or at least you look it, and have no way of disguising yourself to pass for normal. Whether you have wings, claws, or tentacles, the effect is the same—humans who don’t know you react to your presence with mindless fear. If surprised, or in combat, NPCs must make a Stability roll to not flee immediately or attack you.',
  },
  {
    id: 'mandatory_power', name: 'Intrinsic: Mandatory Power (0 Points)', label: 'Mandatory Power', points: 0,
    description: 'Some particular power is an essential part of this Archetype. This Intrinsic does not give you extra Points like other restrictive Intrinsics, but each power that’s mandatory is automatically covered by your Archetype’s Sources, at no extra cost.',
    configKey: 'mandatoryPowerConfig',
  },
  {
    id: 'mutable', name: 'Intrinsic: Mutable (15 Points)', label: 'Mutable', points: 15,
    description: 'At the GM’s discretion, you may purchase entirely new powers during game play.',
  },
  {
    id: 'no_base_will', name: 'Intrinsic: No Base Will (–10 Points)', label: 'No Base Will', points: -10,
    description: 'You have no Base Will and no Willpower score. You are immune to damaging psychological stimuli and powers that directly interfere with perception and thought. You can use powers that require you to bid 1 Willpower point without restriction; if you fail to activate the power, it costs you nothing. However, powers that cost Willpower must have an external Willpower source, such as the Willpower Battery Miracle with the Willpower donated by other characters.',
  },
  {
    id: 'no_willpower', name: 'Intrinsic: No Willpower (–5 Points)', label: 'No Willpower', points: -5,
    description: 'Like an ordinary human, your character has a Base Will score but no Willpower, and thus none of the advantages that go along with it.',
  },
  {
    id: 'no_willpower_no_way', name: 'Intrinsic: No Willpower No Way (–5 Points)', label: 'No Willpower No Way', points: -5,
    description: 'If your Willpower reaches zero, your powers all fail completely until you gain 1 or more.',
  },
  {
    id: 'unhealing', name: 'Intrinsic: Unhealing (-8 Points)', label: 'Unhealing', points: -8,
    description: 'You do not heal naturally and get no benefit from first aid or medical care. The only way to repair damage is to spend 1 Willpower point outside of combat to restore 1 point of Killing or 2 points of Shock. How long this takes is up to the GM, but it should be a significant amount of time. To heal faster, buy the Regeneration power. It’s possible to have this Intrinsic even if you have no Base Will or Willpower score—you rely solely on the kindness of other creatures with Base Will or Willpower to heal your damage. How this happens is up to the GM.',
  },
  {
    id: 'vulnerable', name: 'Intrinsic: Vulnerable (–2 Points per Extra Brain Box)', label: 'Vulnerable',
    points: (config: any) => (config?.extraBoxes || 0) * -2,
    description: 'For each level of this Intrinsic you must designate one additional wound box somewhere on your body as a brain box (see Intrinsic: Globular, page 100), in addition to the basic four. If any four of your various brain boxes are filled with Shock damage, you’re rendered unconscious. If any four are filled with Killing, you’re dead. Be cautious with this Intrinsic—it makes you much more vulnerable to attack.',
    configKey: 'vulnerableConfig',
  },
  {
    id: 'willpower_contest', name: 'Intrinsic: Willpower Contest (–10 Points)', label: 'Willpower Contest', points: -10,
    description: 'Any time you use your powers on a character with Willpower and the target is aware of the attack, you must beat him in a Willpower contest. Both of you “bid” Willpower points during the resolution phase of combat, after you’ve declared and rolled. This is a “blind” bid—each side jots down the bid on scratch paper, then compare the bids. If you bid more than your target, your power works normally. If your target bids more, your power fails. Either way, you each lose the Willpower points that you’ve bid.',
  },
];

    