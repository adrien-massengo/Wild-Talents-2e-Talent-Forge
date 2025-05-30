
// src/lib/miracles-definitions.ts
import type { SkillInstance } from "@/app/page";

export type MiracleQualityType = 
  | 'attacks' | 'defends' | 'useful' 
  | 'hyperstat_body' | 'hyperstat_coordination' | 'hyperstat_sense' 
  | 'hyperstat_mind' | 'hyperstat_charm' | 'hyperstat_command'
  | 'hyperskill'; // Appended with skill ID for specific hyperskills

export type MiracleCapacityType = 'range' | 'mass' | 'speed' | 'touch' | 'self';

export interface PowerQualityDefinition {
  key: MiracleQualityType | string; // string for hyperskill keys like 'hyperskill_athletics'
  label: string;
  baseCostFactor: number; // Cost per normal die (e.g., 2 for Attacks, 4 for Hyperstat Body, 1 for Hyperskill)
}

export const POWER_QUALITY_DEFINITIONS: PowerQualityDefinition[] = [
  { key: 'attacks', label: 'Attacks', baseCostFactor: 2 },
  { key: 'defends', label: 'Defends', baseCostFactor: 2 },
  { key: 'useful', label: 'Useful', baseCostFactor: 2 },
  { key: 'hyperstat_body', label: 'Hyperstat: Body', baseCostFactor: 4 },
  { key: 'hyperstat_coordination', label: 'Hyperstat: Coordination', baseCostFactor: 4 },
  { key: 'hyperstat_sense', label: 'Hyperstat: Sense', baseCostFactor: 4 },
  { key: 'hyperstat_mind', label: 'Hyperstat: Mind', baseCostFactor: 4 },
  { key: 'hyperstat_charm', label: 'Hyperstat: Charm', baseCostFactor: 4 },
  { key: 'hyperstat_command', label: 'Hyperstat: Command', baseCostFactor: 4 },
  // Hyperskills will be dynamically generated based on character skills
];

export const POWER_CAPACITY_OPTIONS: { value: MiracleCapacityType; label: string }[] = [
  { value: 'range', label: 'Range' },
  { value: 'mass', label: 'Mass' },
  { value: 'speed', label: 'Speed' },
  { value: 'touch', label: 'Touch' },
  { value: 'self', label: 'Self' },
];

export interface PredefinedExtraOrFlaw {
  id: string;
  name: string;
  description: string;
  costModifier: number; // Positive for extras, negative for flaws
}

export const PREDEFINED_EXTRAS: PredefinedExtraOrFlaw[] = [
  { id: 'area', name: 'Area', costModifier: 1, description: 'Your power explodes like an area weapon. Area Hard Dice cost +2 each, and Area Wiggle Dice cost +4. Can apply to Attacks, Defends, or Useful.' },
  { id: 'augment', name: 'Augment', costModifier: 4, description: 'Enhances another dice pool’s roll after it\'s been made. Must share a Power Quality (Attacks, Defends, or Useful). Limited when combining Extras or Power Quality Levels.' },
  { id: 'booster', name: 'Booster', costModifier: 1, description: 'Multiplies a Power Capacity (like mass or speed) by 10. If the Power Quality has multiple capacities, you can choose which one to boost each use.' },
  { id: 'burn', name: 'Burn', costModifier: 2, description: 'Your power sets things on fire. Requires touch unless the Power Quality includes range.' },
  { id: 'controlled_effect', name: 'Controlled Effect', costModifier: 1, description: 'Targets only specific individuals (friends, enemies, self, etc.). Take as a Flaw if limiting.' },
  { id: 'daze', name: 'Daze', costModifier: 1, description: 'Reduces the target’s dice pool by width for the next round.' },
  { id: 'deadly_1', name: 'Deadly (+1)', costModifier: 1, description: 'Increases damage: +1 makes Shock attacks do Killing or both.' },
  { id: 'deadly_2', name: 'Deadly (+2)', costModifier: 2, description: 'Increases damage: +2 makes Shock attacks do both Shock and Killing.' },
  { id: 'disintegrate', name: 'Disintegrate', costModifier: 2, description: 'If an attack fills a location with Killing damage, it disintegrates completely.' },
  { id: 'duration', name: 'Duration', costModifier: 2, description: 'Keeps your Miracle active for a scene or several rounds, automatically repeating the same action each round.' },
  { id: 'electrocuting', name: 'Electrocuting', costModifier: 1, description: 'Damage jumps to adjacent hit locations if one is damaged. Applies to Attacks only.' },
  { id: 'endless', name: 'Endless', costModifier: 3, description: 'Miracle remains active indefinitely until you choose to deactivate it.' },
  { id: 'engulf', name: 'Engulf', costModifier: 2, description: 'Affects all hit locations of a target at once. Single defense roll can block it entirely.' },
  { id: 'go_first', name: 'Go First', costModifier: 1, description: 'Increases your roll’s width by 1 for initiative. Stackable for greater bonus.' },
  { id: 'hardened_defense', name: 'Hardened Defense', costModifier: 2, description: 'If paired with Armored Defense, LAR is unaffected by Penetration.' },
  { id: 'high_capacity', name: 'High Capacity (Type)', costModifier: 1, description: 'One capacity of a Power Quality is always maxed out, letting you focus dice on others.' },
  { id: 'interference', name: 'Interference', costModifier: 3, description: 'Opposes another roll before resolution by reducing its width. Works differently from normal opposed rolls.' },
  { id: 'native_power', name: 'Native Power', costModifier: 1, description: 'Your power is a natural ability. It’s unaffected by loss of Willpower or powers like Nullify.' },
  { id: 'no_physics', name: 'No Physics', costModifier: 1, description: 'Ignores physical laws—gravity, inertia, etc.—when using your power.' },
  { id: 'no_upward_limit', name: 'No Upward Limit', costModifier: 2, description: 'Spend Willpower to increase power capacity or width without limit (before rolling).' },
  { id: 'non_physical', name: 'Non-Physical', costModifier: 2, description: 'Ignores static defenses unless defined otherwise. Defense must be appropriate to the nature of the attack.' },
  { id: 'on_sight', name: 'On Sight', costModifier: 1, description: 'Affects any visible target within range, even without direct line of sight.' },
  { id: 'penetration', name: 'Penetration', costModifier: 1, description: 'Reduces target’s armor by 1 per level. Stackable.' },
  { id: 'permanent', name: 'Permanent', costModifier: 4, description: 'Power remains active permanently once turned on. Use with “Always On” Flaw for truly permanent effects.' },
  { id: 'power_capacity_touch', name: 'Power Capacity (Touch)', costModifier: 1, description: 'Adds a new Power Capacity: Touch.' },
  { id: 'power_capacity_mrs', name: 'Power Capacity (Mass/Range/Speed)', costModifier: 2, description: 'Adds a new Power Capacity: Mass, Range, or Speed.' },
  { id: 'radius', name: 'Radius', costModifier: 2, description: 'Affects all targets in a 10-yard radius. Each extra level doubles the radius (20 yards at +4, etc.).' },
  { id: 'speeding_bullet', name: 'Speeding Bullet', costModifier: 2, description: 'Hard to resist; target needs 6+ dice in a relevant Stat to oppose.' },
  { id: 'spray', name: 'Spray', costModifier: 1, description: 'Grants the Spray quality—adds +1d and allows multiple actions without penalty. Stackable, HD/WD cost more.' },
  { id: 'subtle', name: 'Subtle', costModifier: 1, description: 'Goes unnoticed unless detected with a Perception roll.' },
  { id: 'traumatic', name: 'Traumatic', costModifier: 1, description: 'Causes Trauma Checks on successful damage. You must make one too if you inflict trauma deliberately.' },
  { id: 'variable_effect', name: 'Variable Effect', costModifier: 4, description: 'Emulates another power temporarily with a successful roll. Very flexible, but complex in use. Willpower can be spent to add Extras and qualities to emulated effects.' },
];

export const PREDEFINED_FLAWS: PredefinedExtraOrFlaw[] = [
  { id: 'always_on', name: 'Always On', costModifier: -1, description: 'Combines with the Permanent Extra—your power is always active and can’t be deactivated.' },
  { id: 'armored_defense', name: 'Armored Defense', costModifier: -2, description: 'Defends provides LAR instead of rolling. Does not boost defense rolls and is affected by Penetration unless you take Hardened Defense.' },
  { id: 'attached_specific', name: 'Attached (Specific)', costModifier: -2, description: 'Power only activates with a specific Miracle/Skill.' },
  { id: 'attached_general', name: 'Attached (General)', costModifier: -1, description: 'Power only activates with another action, Stat, or Skill type.' },
  { id: 'automatic', name: 'Automatic', costModifier: -1, description: 'A power with Attached activates automatically with its source power, even if you don’t want it to.' },
  { id: 'backfires', name: 'Backfires', costModifier: -2, description: 'Using your power deals 1 point of Killing damage to your torso.' },
  { id: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, description: 'Activating your power permanently consumes 1 Base Will point.' },
  { id: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, description: 'Your power takes time to activate or takes effect later in the scene.' },
  { id: 'depleted', name: 'Depleted', costModifier: -1, description: 'Power has limited charges and recharges. Recharges require in-character actions.' },
  { id: 'direct_feed', name: 'Direct Feed', costModifier: -2, description: 'You lose Willpower equal to the width of your roll every time you use your power.' },
  { id: 'exhausted', name: 'Exhausted', costModifier: -3, description: 'You can use the power only once per encounter or scene.' },
  { id: 'focus', name: 'Focus', costModifier: -1, description: 'Power requires an external object to use and is lost if the object is taken or destroyed.' },
  { id: 'fragile', name: 'Fragile', costModifier: -1, description: 'Your power shuts off if you take damage or are distracted, but you can try again next round.' },
  { id: 'full_power_only', name: 'Full Power Only', costModifier: -1, description: 'Your power always uses maximum effect; you can’t scale it down.' },
  { id: 'go_last', name: 'Go Last', costModifier: -1, description: 'Your power resolves last in a round (treat as width 1 for initiative).' },
  { id: 'horrifying', name: 'Horrifying', costModifier: -1, description: 'Charm rolls suffer penalties with witnesses of your power. Penalty lessens as others acclimate.' },
  { id: 'if_then', name: 'If/Then', costModifier: -1, description: 'Your power only works under specific conditions or fails under others. Can be worth –2 if very restrictive.' },
  { id: 'limited_damage', name: 'Limited Damage', costModifier: -1, description: 'Your attack power only deals either Shock or Killing damage—not both.' },
  { id: 'limited_width', name: 'Limited Width', costModifier: -1, description: 'Power always resolves at width 1, regardless of the actual roll.' },
  { id: 'locational', name: 'Locational', costModifier: -1, description: 'Power tied to a specific hit location. It fails if that location is damaged. Stackable.' },
  { id: 'loopy', name: 'Loopy', costModifier: -1, description: 'Power disorients you; you wander in a daze until passing a Stability roll.' },
  { id: 'mental_strain', name: 'Mental Strain', costModifier: -2, description: 'Using your power causes 1 Shock damage to your head.' },
  { id: 'no_physical_change', name: 'No Physical Change', costModifier: -1, description: 'Power causes no real physical effect—purely perceptual or psychological.' },
  { id: 'obvious', name: 'Obvious', costModifier: -1, description: 'Power is visibly or audibly noticeable when used.' },
  { id: 'one_use', name: 'One Use', costModifier: -4, description: 'Power can only be used once and never again unless repurchased.' },
  { id: 'reduced_capacities', name: 'Reduced Capacities', costModifier: -1, description: 'Power Capacity is reduced to one-tenth of normal.' },
  { id: 'scattered_damage', name: 'Scattered Damage', costModifier: -1, description: 'Damage from your attack affects random hit locations individually.' },
  { id: 'self_only', name: 'Self Only', costModifier: -3, description: 'Power can affect only yourself (not applicable to Defends).' },
  { id: 'slow', name: 'Slow', costModifier: -2, description: 'Power can be used only every other round.' },
  { id: 'touch_only', name: 'Touch Only', costModifier: -2, description: 'Power has no range or extended capacity—only works via physical touch.' },
  { id: 'uncontrollable', name: 'Uncontrollable', costModifier: -2, description: 'Power acts on its own once activated. GM decides its actions.' },
  { id: 'willpower_bid', name: 'Willpower Bid', costModifier: -1, description: 'You must bid 1 Willpower to activate the power. You lose it even on failure.' },
  { id: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, description: 'Power costs 1 Willpower per die, 2 per Hard Die, 4 per Wiggle Die to activate.' },
  { id: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, description: 'Temporarily lose Willpower equal to activation cost. Returned when duration ends.' },
];


export interface AppliedExtraOrFlaw {
  id: string; // Instance ID
  definitionId?: string; // Link to PREDEFINED_EXTRAS/FLAWS
  name: string;
  costModifier: number;
  isCustom: boolean;
}

export interface MiracleQuality {
  id: string; // Instance ID
  type: MiracleQualityType | string; // e.g., 'attacks', 'hyperstat_body', 'hyperskill_uniqueSkillId'
  capacity: MiracleCapacityType;
  levels: number;
  extras: AppliedExtraOrFlaw[];
  flaws: AppliedExtraOrFlaw[];
}

export interface MiracleDefinition {
  id: string; // Unique ID for the miracle instance
  definitionId?: string; // If based on a predefined miracle
  name: string;
  dice: string; // e.g., "1D"
  hardDice: string; // e.g., "0HD"
  wiggleDice: string; // e.g., "0WD"
  qualities: MiracleQuality[];
  description: string;
  isCustom: boolean;
  isMandatory: boolean;
}

export const PREDEFINED_MIRACLES_TEMPLATES: Omit<MiracleDefinition, 'id' | 'isCustom' | 'isMandatory' | 'dice' | 'hardDice' | 'wiggleDice' >[] = [
  {
    definitionId: 'absorb_energy',
    name: 'Absorb Energy (Type)',
    description: 'Absorb Energy lets you drain the energy out of anything or anyone you touch. This can protect you from attack once you have activated the effect. In addition, you can impede non-combat actions by touching the target and draining energy. (Base cost 8 before dice)',
    qualities: [
      {
        id: 'absorb_defends_quality',
        type: 'defends',
        capacity: 'touch',
        levels: 0,
        extras: [
          { id: 'dur_1', definitionId: 'duration', name: 'Duration', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='duration')!.costModifier, isCustom: false },
          { id: 'int_1', definitionId: 'interference', name: 'Interference', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='interference')!.costModifier, isCustom: false },
        ],
        flaws: [
          { id: 'tou_1', definitionId: 'touch_only', name: 'Touch Only', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='touch_only')!.costModifier, isCustom: false },
        ],
      },
      {
        id: 'absorb_useful_quality',
        type: 'useful',
        capacity: 'touch',
        levels: 0,
        extras: [
           { id: 'int_2', definitionId: 'interference', name: 'Interference', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='interference')!.costModifier, isCustom: false },
        ],
        flaws: [
           { id: 'tou_2', definitionId: 'touch_only', name: 'Touch Only', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='touch_only')!.costModifier, isCustom: false },
        ],
      }
    ],
  },
  {
    definitionId: 'aces',
    name: 'Aces',
    description: 'You’re lucky. Insanely, impossibly, miraculously lucky. Thanks to the ‘Augment’ Extra, In the resolution phase you can add Aces dice to another action at a cost of 1 Willpower per Aces die, 2 per Hard Die, and 4 per Wigge Die. (Base cost 9 before dice)',
    qualities: [
      {
        id: 'aces_attacks_quality',
        type: 'attacks',
        capacity: 'self',
        levels: 0,
        extras: [
          { id: 'aug_1', definitionId: 'augment', name: 'Augment', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='augment')!.costModifier, isCustom: false },
        ],
        flaws: [
          { id: 'ift_1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='if_then')!.costModifier, isCustom: false },
          { id: 'wc_1', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='willpower_cost')!.costModifier, isCustom: false },
        ],
      },
      {
        id: 'aces_defends_quality',
        type: 'defends',
        capacity: 'self',
        levels: 0,
        extras: [
          { id: 'aug_2', definitionId: 'augment', name: 'Augment', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='augment')!.costModifier, isCustom: false },
        ],
        flaws: [
          { id: 'ift_2', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='if_then')!.costModifier, isCustom: false },
          { id: 'wc_2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='willpower_cost')!.costModifier, isCustom: false },
        ],
      },
      {
        id: 'aces_useful_quality',
        type: 'useful', // The example implies this can augment Attacks, but it should be a Useful quality that augments.
        capacity: 'self',
        levels: 0, // The (+2) in the prompt seems like an old cost, Augment is +4.
        extras: [
          { id: 'aug_3', definitionId: 'augment', name: 'Augment', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='augment')!.costModifier, isCustom: false },
          // The "Attacks +2" extra on a useful quality is non-standard. Augment is the key here.
        ],
        flaws: [
          { id: 'ift_3', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='if_then')!.costModifier, isCustom: false },
          { id: 'wc_3', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='willpower_cost')!.costModifier, isCustom: false },
        ],
      }
    ],
  }
];

// Helper function to generate dynamic hyperskill quality definitions
export const getDynamicPowerQualityDefinitions = (skills: SkillInstance[]): PowerQualityDefinition[] => {
  const hyperskillDefinitions: PowerQualityDefinition[] = skills.map(skill => ({
    key: `hyperskill_${skill.id}`, // Use skill instance ID for uniqueness
    label: `Hyperskill: ${skill.name}`,
    baseCostFactor: 1, // Hyperskills cost 1 per die
  }));
  return [...POWER_QUALITY_DEFINITIONS, ...hyperskillDefinitions];
};
