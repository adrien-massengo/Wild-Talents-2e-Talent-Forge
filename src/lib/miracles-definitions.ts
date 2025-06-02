
// src/lib/miracles-definitions.ts
import type { SkillInstance } from "@/app/page";

export type MiracleQualityType =
  | 'attacks' | 'defends' | 'useful'
  | 'hyperstat_body' | 'hyperstat_coordination' | 'hyperstat_sense'
  | 'hyperstat_mind' | 'hyperstat_charm' | 'hyperstat_command'
  | 'hyperskill'; // Appended with skill ID for specific hyperskills

export type MiracleCapacityType = 'range' | 'mass' | 'speed' | 'touch' | 'self' | 'n_a'; // Added N/A

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
  { value: 'n_a', label: 'N/A (No Capacity)'},
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
  { id: 'see_it_first', name: 'See It First', costModifier: -1, description: 'For this quality to work the target must be visible.' },
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
    description: 'Absorb Energy lets you drain the energy out of anything or anyone you touch. This can protect you from attack once you have activated the effect. In addition, you can impede non-combat actions by touching the target and draining energy.',
    qualities: [
      {
        id: 'ae_q1',
        type: 'defends',
        capacity: 'touch',
        levels: 0,
        extras: [
          { id: 'ae_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='duration')!.costModifier, isCustom: false },
          { id: 'ae_q1_ex2', definitionId: 'interference', name: 'Interference', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='interference')!.costModifier, isCustom: false },
        ],
        flaws: [
          { id: 'ae_q1_fl1', definitionId: 'touch_only', name: 'Touch Only', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='touch_only')!.costModifier, isCustom: false },
        ],
      },
      {
        id: 'ae_q2',
        type: 'useful',
        capacity: 'touch',
        levels: 0,
        extras: [
           { id: 'ae_q2_ex1', definitionId: 'interference', name: 'Interference', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='interference')!.costModifier, isCustom: false },
        ],
        flaws: [
           { id: 'ae_q2_fl1', definitionId: 'touch_only', name: 'Touch Only', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='touch_only')!.costModifier, isCustom: false },
        ],
      }
    ],
  },
  {
    definitionId: 'aces',
    name: 'Aces',
    description: 'You’re lucky. Insanely, impossibly, miraculously lucky. Thanks to the ‘Augment’ Extra, In the resolution phase you can add Aces dice to another action at a cost of 1 Willpower per Aces die, 2 per Hard Die, and 4 per Wigge Die. (See page 123 for the limitations of Augment.)',
    qualities: [
      {
        id: 'aces_q1',
        type: 'attacks',
        capacity: 'self',
        levels: 0,
        extras: [
          { id: 'aces_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='augment')!.costModifier, isCustom: false },
        ],
        flaws: [
          { id: 'aces_q1_fl1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='if_then')!.costModifier, isCustom: false },
          { id: 'aces_q1_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='willpower_cost')!.costModifier, isCustom: false },
        ],
      },
      {
        id: 'aces_q2',
        type: 'defends',
        capacity: 'self',
        levels: 0,
        extras: [
          { id: 'aces_q2_ex1', definitionId: 'augment', name: 'Augment', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='augment')!.costModifier, isCustom: false },
        ],
        flaws: [
          { id: 'aces_q2_fl1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='if_then')!.costModifier, isCustom: false },
          { id: 'aces_q2_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='willpower_cost')!.costModifier, isCustom: false },
        ],
      },
      {
        id: 'aces_q3',
        type: 'useful',
        capacity: 'self',
        levels: 0,
        extras: [
          { id: 'aces_q3_ex1', definitionId: 'augment', name: 'Augment', costModifier: PREDEFINED_EXTRAS.find(e=>e.id==='augment')!.costModifier, isCustom: false },
          // The "Attacks +2" extra on a useful quality is non-standard. Interpreting this as just Augment.
        ],
        flaws: [
          { id: 'aces_q3_fl1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='if_then')!.costModifier, isCustom: false },
          { id: 'aces_q3_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='willpower_cost')!.costModifier, isCustom: false },
        ],
      }
    ],
  },
  {
    definitionId: 'alternate_forms',
    name: 'Alternate Forms',
    description: "You can change your shape. Using the Variable Effect Extra you can gain new powers to go along with it: Just “transfer” each die of Alternate Forms to a separate power for the duration, and spend Willpower to gain new Extras and Power Quality Levels, such as increased damage or protection.\nYou retain your own Stats and Skills when you change forms, but you can use the Alternate Forms dice to increase them.\nIf you want to change your Stats and Skills when you change forms, take a separate Useful quality. Roll to activate it and you can rearrange your Stat and Skill dice however you like, then use Alternate Forms’ Variable Effect qualities to add power dice. You might want to add If/Then to the Variable Effect qualities to specify that you can use them only when you initiate your transformation by rolling to activate that “change Stats” quality. (That will actually reduce the cost of the overall power, but the downside is that you need to roll to activate it in the first place instead of just rearranging your dice with Variable Effect.)\nIf you want additional Stats, Skills or powers that work only in a particular alternate form, buy them normally and use the Attached Flaw to link them to Alternate Forms. This is a great way to set up a character who is a normal human being but who can transform into a powered alternate form.\nIf you want some of your normal Stats, Skills and powers to NOT work when you’re in an alternate form, take the If/Then Flaw on each of them. (Players and GMs alike, be careful here. Taking If/Then on a whole host of powers just because they don’t work when you’re using a single power that you never actually use might be fishy. Remember, if a Flaw is not a significant drawback, it’s worth no Points.)\nWhat if your character’s normal body remains unharmed no matter how much punishment an alternate form takes? That’s pretty handy, so take that as another Useful quality (page 108) without Variable Effect. Roll to activate that Useful quality and you turn back to human, unharmed. (But that particular alternate form remains hurt until you stay in it long enough for it to heal.)\nYou can reduce the cost of Alternate Forms by applying Flaws to its Power Qualities that limit the kinds of powers you can gain or, by restricting the Useful quality, the kinds of shapes you can take. The exact value of the Flaw is up to you, the GM and the other players, but generally a (–1) Flaw should be somewhat restricting (a family of related shapes), while a (–2) Flaw could restrict you to a single shape.",
    qualities: [
      {
        id: 'af_q1_atk', type: 'attacks', capacity: 'self', levels: 0,
        extras: [
          { id: 'af_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'af_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'af_q1_fl1', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for shape changing)', costModifier: -1, isCustom: false },
          { id: 'af_q1_fl2', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'af_q2_def', type: 'defends', capacity: 'self', levels: 0,
        extras: [
          { id: 'af_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'af_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'af_q2_fl1', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for shape changing)', costModifier: -1, isCustom: false },
          { id: 'af_q2_fl2', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'af_q3_use', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'af_q3_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'af_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'af_q3_fl1', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for shape changing)', costModifier: -1, isCustom: false },
          { id: 'af_q3_fl2', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'anger_realiser_gun',
    name: 'Anger Realiser Gun',
    description: "",
    qualities: [
      {
        id: 'arg_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
        extras: [
          { id: 'arg_q1_ex1', definitionId: 'go_first', name: 'Go First x5', costModifier: 5, isCustom: false }, // Assuming Go First stacks linearly
        ],
        flaws: [
          { id: 'arg_q1_fl1', definitionId: 'focus', name: 'Focus', costModifier: -1, isCustom: false },
          { id: 'arg_q1_fl2', definitionId: 'limited_damage', name: 'Limited Damage (Type)', costModifier: -1, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'bind',
    name: 'Bind',
    description: "Your power immobilizes a target at a distance. A bound target cannot take any actions. The Power Capacity (Mass) Extra allows you to hold fast an inanimate mass at range. To hold another character your Bind roll must succeed in a contest with the target’s Brawling Skill roll or whatever other dice pool the GM thinks could resist your power. A bound target can attempt to escape once per round.\nYou can decide the exact form that your power takes—powerful webbing, a force field, a cocoon of iron, whatever—when your character gains the power. To change its form take the Variable Effect Extra on Useful.",
    qualities: [
      {
        id: 'bind_q1_use', type: 'useful', capacity: 'mass', levels: 0, // Default capacity is mass, range is added by extra
        extras: [
            // Power Capacity (Mass) (+2) is already inherent in capacity: 'mass' and range
            // For a 'Useful' quality, capacity 'mass' & 'range' implies both.
            // The text "Power Capacity (Mass) Extra allows you to hold fast an inanimate mass at range."
            // and "To hold another character your Bind roll must succeed...".
            // This implies the base quality works for characters (range) and the mass extra is for inanimate objects.
            // Let's model as capacity 'range' initially and add Power Capacity (Mass) as an extra.
            // OR make base capacity 'mass' and add Power Capacity (Range) as an extra.
            // Given the text "Power Capacity (Mass) Extra allows...", let's assume primary capacity is range for animate targets.
            // { id: 'bind_q1_ex1', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Mass)', costModifier: 2, isCustom: false }
            // The text says capacity: Mass, Range. I'll set capacity to mass and add range as extra.
            { id: 'bind_q1_ex1', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
        ],
        flaws: []
      }
    ]
  },
   {
    definitionId: 'block_miracle', // Renamed to avoid conflict with skill
    name: 'Block (Miracle)',
    description: "You can use Block as a defence roll, just like dodging or blocking. To gain more “gobble” dice, increase its Defends quality.",
    qualities: [
      {
        id: 'block_m_q1_def', type: 'defends', capacity: 'self', levels: 0,
        extras: [],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'brainwash',
    name: 'Brainwash',
    description: "You are able to instill one of either your passions or loyalties into someone else. By spending a point of base will, and then rolling the power dice pool, the spent point of base will, as well as width +3 in unallocated base will in the subjects base will reserve, is permanently allotted to the passion or loyalty of your choice.\nShould they choose to spend this base will point, they will suffer the effects of failing the passion/ loyalty. See Willpower rules.",
    qualities: [
      {
        id: 'brain_q1_use', type: 'useful', capacity: 'touch', levels: 3, // "Useful (Instill Motivation) +3"
        extras: [
          { id: 'brain_q1_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'brain_q1_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
          { id: 'brain_q1_fl2', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
          { id: 'brain_q1_fl3', definitionId: 'if_then', name: 'If/Then (Base Will transfers over to target)', costModifier: -1, isCustom: false },
          { id: 'brain_q1_fl4', definitionId: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, isCustom: false }, // Using standard -4
          { id: 'brain_q1_fl5', definitionId: 'touch_only', name: 'Touch Only', costModifier: -2, isCustom: false },
          { id: 'brain_q1_fl6', definitionId: 'uncontrollable', name: 'Uncontrollable', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'circumstance_bonus',
    name: 'Circumstance Bonus',
    description: "The user gains width in dice from this power to augment any rolls during a scene, based on the amount of times a particular circumstance occurs.\nThe available width extra determines the amount of dice that can be used. For instance, if 2 wound boxes are filled, then 2 dice are granted from this power. If there are a total of 6 dice in this power, the user would need 6 wound boxes filled with damage before they could roll them all.\nFor example, the user may draw dice from his power the more wound boxes are filled, or the more times he is hit. This can also be altered so that the user can deal out additional damage the more they are hit ala Nintendo game bosses, or perhaps becomes quicker each time they are able to draw energy.",
    qualities: [
      {
        id: 'cb_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
        extras: [ { id: 'cb_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false } ],
        flaws: [
          { id: 'cb_q1_fl1', name: '"Available Width"', costModifier: -1, isCustom: true },
          { id: 'cb_q1_fl2', definitionId: 'if_then', name: 'If/Then (Circumstance)', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'cb_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
        extras: [ { id: 'cb_q2_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false } ],
        flaws: [
          { id: 'cb_q2_fl1', name: '"Available Width"', costModifier: -1, isCustom: true },
          { id: 'cb_q2_fl2', definitionId: 'if_then', name: 'If/Then (Circumstance)', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'cb_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
        extras: [ { id: 'cb_q3_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false } ],
        flaws: [
          { id: 'cb_q3_fl1', name: '"Available Width"', costModifier: -1, isCustom: true },
          { id: 'cb_q3_fl2', definitionId: 'if_then', name: 'If/Then (Circumstance)', costModifier: -1, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'containment',
    name: 'Containment',
    description: "You can create a force field or other effect that contains masses at a distance. It holds things in place up to its mass capacity; to break free, any character within its radius must beat its roll with a Brawling roll or whatever other action the GM thinks could overcome your power. With the Controlled Effect Extra, you can specify which characters in the radius are affected, or set it up as a screen that keeps things outside it at bay but leaves things inside it free to move around.",
    qualities: [
      {
        id: 'cont_q1_def', type: 'defends', capacity: 'range', levels: 0,
        extras: [
          { id: 'cont_q1_ex1', definitionId: 'controlled_effect', name: 'Controlled Effect', costModifier: 1, isCustom: false },
          { id: 'cont_q1_ex2', definitionId: 'radius', name: 'Radius', costModifier: 2, isCustom: false },
          // Power Capacity (Range) is inherent if capacity is 'range'. The text might imply it's an extra to emphasize its presence.
        ],
        flaws: []
      },
      {
        id: 'cont_q2_use', type: 'useful', capacity: 'mass', levels: 0, // Base capacity mass, range added via extra
        extras: [
          { id: 'cont_q2_ex1', definitionId: 'controlled_effect', name: 'Controlled Effect', costModifier: 1, isCustom: false },
          { id: 'cont_q2_ex2', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false },
          { id: 'cont_q2_ex3', definitionId: 'radius', name: 'Radius', costModifier: 2, isCustom: false }
        ],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'control_type',
    name: 'Control (Type)',
    description: "You have superhuman control over some energy or substance. If you control a form of substance, your power has a mass capacity; if you control energy, you can control any amount of that energy within the power’s range. To have both range and mass capacities—to manipulate solid matter at a distance—take the Extra Power Capacity (Range) or (Mass).\nBy default, the cost of Control does not depend on the type of energy or substance, or how rare or common it is. If you choose a very specific, hard-to-find substance or energy, you might take If/Then or an equivalent Flaw to reflect its low utility. For an exceptionally broad power to control things, take the Variable Effect Extra.\nBy manipulating the substance or energy you can use it to attack, to block attacks, and to form intricate useful shapes or perform tasks. The controlled substance or energy reverts to normal when your Control action ends.\nControl does not allow you to create the substance or energy out of thin air. That requires a separate Miracle (for an example see Create, page 144 ) or another Useful quality (page 108).",
    qualities: [
      { id: 'ctrl_q1_atk', type: 'attacks', capacity: 'mass', levels: 0, extras: [], flaws: [] }, // or range, user specifies type
      { id: 'ctrl_q2_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
      { id: 'ctrl_q3_use', type: 'useful', capacity: 'mass', levels: 0, extras: [], flaws: [] }  // or range
    ]
  },
  {
    definitionId: 'cosmic_power',
    name: 'Cosmic Power',
    description: "With a successful roll you can temporarily manifest any new Miracle that you wish. Cosmic Power by itself does nothing, but it can emulate any power. Use the Variable Effect Extra to “transfer” each die of Cosmic Power to a separate power for the duration, and spend Willpower to gain new Extras and Power Quality Levels, such as increased damage or protection.\nExample: Cosmic Power Orrel “Prince Voodoo” Mackenzie has 5d+2wd in a Miracle called Loa Power (A D U) with the standard Cosmic Power Extras and Flaws. This Miracle costs 21 Points per die, or 273 Points. Prince Voodoo uses the Variable Effect Extra on his power’s Useful quality to emulate a power he calls Spy On Distant Enemy. He uses 3d+1wd of his Loa Power Miracle to emulate Spy On Distant Enemy, leaving him 2d+1wd that he could use to emulate some other power or use with Loa Power itself. Prince Voodoo takes four levels of Booster on Spy On Distant Enemy’s range capacity, for (+4) Points per die, to give it a range of about 50 miles (80 km.). For 2d+1wd, that costs 24 Willpower with a successful roll to activate Loa Power.",
    qualities: [
      {
        id: 'cp_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
        extras: [
          { id: 'cp_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'cp_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'cp_q1_fl1', definitionId: 'if_then', name: 'If/Then (must be used for Variable Effect)', costModifier: -1, isCustom: false },
          { id: 'cp_q1_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
        ]
      },
      {
        id: 'cp_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
        extras: [
          { id: 'cp_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'cp_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'cp_q2_fl1', definitionId: 'if_then', name: 'If/Then (must be used for Variable Effect)', costModifier: -1, isCustom: false },
          { id: 'cp_q2_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
        ]
      },
      {
        id: 'cp_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
        extras: [
          { id: 'cp_q3_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'cp_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'cp_q3_fl1', definitionId: 'if_then', name: 'If/Then (must be used for Variable Effect)', costModifier: -1, isCustom: false },
          { id: 'cp_q3_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'create_type',
    name: 'Create (Type)',
    description: "You can create some energy or substance out of thin air. You must define a specific type of substance or energy and stick with it; to be able to change it, add the Variable Effect Extra to the Useful quality. As written, Create assumes you can use the substance or energy to destroy things or to avoid harm, blasting away with fire, deflecting attacks with a sudden hailstorm or whatever your specific power does.\nThis power does not give you supernatural control over the thing that you’ve created; that requires a separate Miracle (for an example see Control, page 142) or a separate Useful quality (page 107). Nor does it give you immunity to your creation—at least, not without yet another Useful quality or a Miracle such as Immunity (page 149 )—so be careful where you stand when you use your power.",
    qualities: [
      { id: 'cr_q1_atk', type: 'attacks', capacity: 'mass', levels: 0, extras: [], flaws: [] }, // or range
      { id: 'cr_q2_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
      { id: 'cr_q3_use', type: 'useful', capacity: 'mass', levels: 0, extras: [], flaws: [] }  // or range
    ]
  },
  {
    definitionId: 'cryokinesis',
    name: 'Cryokinesis',
    description: "You attack your target by lowering its internal temperature greatly, causing severe damage akin to serious frostbite. This deals WSK to each hit location; if the target would be incapacitated or killed, it is frozen solid. The cold slows the target’s actions; reduce the target’s dice pools by your Width on the next round. This effect ignores armor, but it can be resisted with an Endurance roll.",
    qualities: [
      {
        id: 'cryo_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
        extras: [
          { id: 'cryo_q1_ex1', definitionId: 'daze', name: 'Daze', costModifier: 1, isCustom: false },
          { id: 'cryo_q1_ex2', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
          { id: 'cryo_q1_ex3', definitionId: 'non_physical', name: 'Non-Physical', costModifier: 2, isCustom: false }
        ],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'custom_hit_locations',
    name: 'Custom Hit Locations',
    description: "When you activate this power you can rearrange your hit locations and their 34 wound boxes in any manner you like. You must still spread them among 10 hit location numbers, but you can choose how many or how few locations you have; if you want all 10 hit location numbers in one 3434-box hit location, you can. You can’t have more than 10 hit location numbers, however, and therefore you can’t have more than 10 hit locations.\nYou must designate one of your hit locations as your “core” location. If its wound boxes are all filled with Shock or Killing damage, the effect is the same as when a human torso’s wound boxes are filled with damage.\nYou must also designate four of your wound boxes as brain boxes. When those particular four boxes are all filled with Shock damage, you’re knocked unconscious. If they are all filled with Killing, you die. A strangling attack (page 68 ) can target any hit location that has a brain box. It’s a good idea to highlight those brain boxes on the hit location chart so you remember exactly where they are.\nIf your brain boxes are in a hit location that also has normal wound boxes, they always suffer damage last when that hit location is struck. Shock damage in the non-brain boxes turns to Killing damage before new damage spills over into the brain boxes.\nDamage to your wound boxes recovers normally. If and when you change back to a normal human form, you can distribute injured wound boxes however you like, except for damage to “core” or “brain” wound boxes. Damage to “core” boxes goes to your human torso, and damage to “brain” boxes goes to your human head.\nThis power gives you one particular set of custom hit locations; define them when you take this power. To be able to change them around, use the Variable Effect Extra.",
    qualities: [
      {
        id: 'chl_q1_use', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'chl_q1_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'chl_q1_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
          { id: 'chl_q1_fl2', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'dead_ringer',
    name: 'Dead Ringer',
    description: "You can change your appearance to impersonate anyone or anything of about the same size. To change your size significantly requires its own Miracle, such as Size Shift (page 156), or another Useful quality.",
    qualities: [
      {
        id: 'dr_q1_use', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'dr_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
          { id: 'dr_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'dr_q1_fl1', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for choosing different appearances)', costModifier: -1, isCustom: false },
          { id: 'dr_q1_fl2', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'dodge_podge',
    name: 'Dodge Podge',
    description: "Gets out of the way of most attacks without even trying.",
    qualities: [
      {
        id: 'dp_q1_hs', type: 'hyperskill_dodge', capacity: 'n_a', levels: 0, // Assuming 'dodge' is the ID for Dodge skill
        extras: [
          { id: 'dp_q1_ex1', definitionId: 'go_first', name: 'Go First x3', costModifier: 3, isCustom: false },
          { id: 'dp_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'duplicates',
    name: 'Duplicates',
    description: "With a roll of the “helpers” quality you can create width in physical duplicates who can help you accomplish any action. Add one bonus die per duplicate to each dice pool for the power’s duration as your twins cooperate with you on each task. (This is equivalent to characters cooperating with each other on difficult tasks; see page 25.)\nThe “real me” Power Quality makes it difficult for others to determine which is your original character—they need a Scrutiny roll in a contest with your Duplicates activation roll to tell you from your duplicates.\nDuplicates’ Defends quality represents the fact that enemies have many potential targets and no way to tell which is really you. It automatically rolls your Duplicates dice pool as a defence roll (with the Interference Extra!) whenever you are attacked. An attack that it spoils hits one of your doubles rather than harming you.",
    qualities: [
      {
        id: 'dup_q1_def', type: 'defends', capacity: 'self', levels: 0,
        extras: [
          { id: 'dup_q1_ex1', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false },
          { id: 'dup_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'dup_q1_fl1', definitionId: 'attached_specific', name: 'Attached (“helpers” quality)', costModifier: -2, isCustom: false }
        ]
      },
      {
        id: 'dup_q2_use_helpers', type: 'useful', capacity: 'self', levels: 0, // For "helpers"
        extras: [
          { id: 'dup_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
        ],
        flaws: [
          { id: 'dup_q2_fl1', definitionId: 'obvious', name: 'Obvious', costModifier: -1, isCustom: false },
          { id: 'dup_q2_fl2', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      },
      {
        id: 'dup_q3_use_realme', type: 'useful', capacity: 'range', levels: 0, // For "the real me"
        extras: [
          { id: 'dup_q3_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'dup_q3_fl1', definitionId: 'attached_specific', name: 'Attached (“helpers” quality)', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'elasticity',
    name: 'Elasticity',
    description: "You can stretch your body out to the range of your power and squeeze it through tight spaces. Use your Body and Coordination Stats and Skills as usual to do things; the power simply allows you to stretch and use them at a distance. As with other powers, Elasticity requires its own dice pool to activate it under difficult circumstances such as combat; if you want to stretch and make a Body or Coordination roll in the same round, you need multiple actions unless the GM says Elasticity doesn’t require a roll.",
    qualities: [
      {
        id: 'elas_q1_use', type: 'useful', capacity: 'range', levels: 0,
        extras: [],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'extra_tough',
    name: 'Extra Tough',
    description: "When you activate this power, it gives you width in additional wound boxes on every hit location. Extra Tough is typically bought with Hard Dice to guarantee its width.",
    qualities: [
      {
        id: 'et_q1_use', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'et_q1_ex1', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
          { id: 'et_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'et_q1_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'flight',
    name: 'Flight',
    description: "You can fly! See page 112 to determine your base speed.",
    qualities: [
      { id: 'fli_q1_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
      { id: 'fli_q2_use', type: 'useful', capacity: 'speed', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'gadgeteering',
    name: 'Gadgeteering',
    description: "You can create gadgets with amazing powers. With a successful Gadgeteering roll you can use the Variable Effect Extra to “transfer” Gadgeteering dice into a new power.\nThe “weird technology” theme for Variable Effect requires all the new powers to be built in foci. If a focus is destroyed, you get the transferred dice back but lose one point of Willpower per “transferred” die, two Willpower per Hard Die, and four Willpower per Wiggle Die. If you deliberately disassemble the focus yourself, you get all the invested Willpower back.\nGadgeteering’s “Modifications” effect allows you to manipulate power foci belonging to others. You can disassemble or modify another character’s focus with a Gadgeteering roll against the largest dice pool in that focus. However, you can’t disassemble or modify a focus with the Immutable Flaw, and you can’t disassemble a focus that has the Indestructible Extra.\nWhen you disassemble a focus you take it apart to see what makes it tick. You gain 1 Willpower per die, 2 Willpower per Hard Die, and 4 Willpower per Wiggle Die of all powers contained in the focus, and the focus loses all its powers.\nTo modify someone else’s focus, you can “transfer” some of your Gadgeteering dice to a power within it, either to augment a current power or to add an entirely new power.\nIf you want to create a gadget that sticks around permanently—separately from your Gadgeteering dice pool, so you can free up those dice for other gadgets—you can do so by spending Willpower equal to the total Point cost of the power, including all Extras and Flaws, and then spending a point of Base Will. This works just like picking up a new power (page 57 ); the Gadgeteering power lets you do this any time you want, even without the Mutable Archetype quality, as long as you’re building a gadget.\nA version of Gadgeteering that allows you to create and modify magical artifacts might be called Enchanting or Alchemy. It would work the same way, but you can’t create or modify technological gadgets, only enchanted things.",
    qualities: [
      {
        id: 'gadg_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
        extras: [
          { id: 'gadg_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
          { id: 'gadg_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'gadg_q1_fl1', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
          { id: 'gadg_q1_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect requires a workshop and time to work)', costModifier: -1, isCustom: false },
          { id: 'gadg_q1_fl3', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for weird technology)', costModifier: -1, isCustom: false },
          { id: 'gadg_q1_fl4', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'gadg_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
        extras: [
          { id: 'gadg_q2_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
          { id: 'gadg_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'gadg_q2_fl1', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
          { id: 'gadg_q2_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect requires a workshop and time to work)', costModifier: -1, isCustom: false },
          { id: 'gadg_q2_fl3', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for weird technology)', costModifier: -1, isCustom: false },
          { id: 'gadg_q2_fl4', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'gadg_q3_use_create', type: 'useful', capacity: 'n_a', levels: 0, // "Gadget Creation"
        extras: [
          { id: 'gadg_q3_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
          { id: 'gadg_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'gadg_q3_fl1', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
          { id: 'gadg_q3_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect requires a workshop and time to work)', costModifier: -1, isCustom: false },
          { id: 'gadg_q3_fl3', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for weird technology)', costModifier: -1, isCustom: false },
          { id: 'gadg_q3_fl4', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
        ]
      },
      {
        id: 'gadg_q4_use_disasm', type: 'useful', capacity: 'touch', levels: 1, // "Gadget Disassembly +1"
        extras: [
          { id: 'gadg_q4_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false }
        ],
        flaws: [
          { id: 'gadg_q4_fl1', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
          { id: 'gadg_q4_fl2', definitionId: 'if_then', name: 'If/Then (requires a workshop and time to work)', costModifier: -1, isCustom: false },
          { id: 'gadg_q4_fl3', definitionId: 'touch_only', name: 'Touch Only', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'ghost',
    name: 'Ghost',
    description: "You can manifest a semi-substantial clone of yourself into which you can place your consciousness. While you wander in the ghost your body remains behind, unconscious.\nThis “ghost” cannot interact with the physical world but can observe and can pass through solid objects and barriers.\nAny successful attack dissipates your “ghost”—it has no wound boxes and no armor—but Ghost’s Defends quality allows you to make defence rolls to avoid harm.\nTo allow it to stand up to punishment give it the Armored defence Flaw on Defends or wound boxes with the Extra Tough Miracle and the Flaw Attached to Ghost.\nTo be able to interact with the physical world add the Attacks quality and the Power Capacity (Mass) Extra.",
    qualities: [
      { id: 'ghost_q1_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
      {
        id: 'ghost_q2_use', type: 'useful', capacity: 'range', levels: 0,
        extras: [
          { id: 'ghost_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
        ],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'goodnight_gorilla',
    name: 'Goodnight, Gorilla',
    description: "Psychic whammy Punch. Fantastic at flooring characters early in combat.",
    qualities: [
      {
        id: 'gg_q1_atk', type: 'attacks', capacity: 'mass', levels: 0,
        extras: [
          { id: 'gg_q1_ex1', definitionId: 'non_physical', name: 'Non-Physical', costModifier: 2, isCustom: false }
        ],
        flaws: []
      }
    ]
  },
  {
    definitionId: 'harm',
    name: 'Harm',
    description: "You can hurt things. Make an attack roll to inflict width in Shock and Killing damage. With the range capacity, you can attack at a distance. With mass, your Harm attack does knockback. To increase Harm’s damage, increase its Attacks quality.",
    qualities: [
      { id: 'harm_q1_atk', type: 'attacks', capacity: 'mass', levels: 0, extras: [], flaws: [] } // or range
    ]
  },
  {
    definitionId: 'healing',
    name: 'Healing',
    description: "You can heal injured living tissue. With a Healing roll you cause a living target to instantly heal width in Shock and Killing damage from a single hit location of your choice.\nTo be able to heal diseases or toxins that don’t inflict physical damage, take a separate Useful quality.",
    qualities: [
      {
        id: 'heal_q1_use', type: 'useful', capacity: 'touch', levels: 1, // Useful (+1)
        extras: [],
        flaws: [
          { id: 'heal_q1_fl1', definitionId: 'touch_only', name: 'Touch Only', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'heavy_armour',
    name: 'Heavy Armour',
    description: "Each die in your Heavy Armour set removes one die of equal or lesser height from every attack that hits you. To emulate a true Heavy Armor Rating (page 64 ), take Hard Dice in Heavy Armor for a guaranteed height of 10. Any attack with width lower than your Heavy Armor roll automatically bounces right off.\nThanks to the Armored defence Flaw, an attack with the Penetration quality (or a Miracle with the Penetration Extra) reduces your Heavy Armor by one per point of Penetration.\nChapter 4: Combat describes the various levels of Heavy Armor. Of course, you also need to decide whether Heavy Armor by itself is enough protection. Heavy Armor works like a really thick eggshell: If an attack has enough Penetration to crack your armor, you’ll take ALL the damage. For a really resilient character, you might want to take some Light Armor (maybe even with Hardened defence) or some Extra Tough to stand up to damage that does get past your Heavy Armor.",
    qualities: [
      {
        id: 'ha_q1_def', type: 'defends', capacity: 'self', levels: 0,
        extras: [
          { id: 'ha_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
          { id: 'ha_q1_ex2', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false }
        ],
        flaws: [
          { id: 'ha_q1_fl1', definitionId: 'armored_defense', name: 'Armored defence', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'illusions',
    name: 'Illusions',
    description: "You can create an illusion that makes a target see, hear, feel or smell anything you want. To convince a target that the illusion is real, roll against the target’s Scrutiny Skill roll.\nWith the Attacks quality you can trick the target’s body into reacting as if he or she has been injured, inflicting width in (genuine) Shock and Killing damage. With Defends you can use illusions to distract an attacker.\nTo affect more than one target, use multiple actions or take the Radius Extra.\nIf your power is instead a psychic hallucination that only affects characters who have Base Will (that is, it doesn’t affect robots and security cameras; see page 98 ), take the No Physical Change Flaw for (–1) on Attacks, Defends and Useful.",
    qualities: [
      { id: 'ill_q1_atk', type: 'attacks', capacity: 'range', levels: 0, extras: [], flaws: [] },
      { id: 'ill_q2_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
      { id: 'ill_q3_use', type: 'useful', capacity: 'range', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'immortality',
    name: 'Immortality',
    description: "First useful quality is the standard regeneration. Heals wounds as needed.\nSecond useful quality restores lost limbs and organs.\nThird useful quality, activates as soon as either the head or body is filled with killing damage. Brings the wielder back to life after a certain time.",
    qualities: [
      { // Regeneration
        id: 'immo_q1_use_regen', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'immo_q1_ex1', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
          { id: 'immo_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'immo_q1_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
          { id: 'immo_q1_fl2', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      },
      { // Limb and Organ Regrowth
        id: 'immo_q2_use_limbs', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'immo_q2_ex1', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
          { id: 'immo_q2_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'immo_q2_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
          { id: 'immo_q2_fl2', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      },
      { // Immortality (revival)
        id: 'immo_q3_use_revive', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'immo_q3_ex1', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
          { id: 'immo_q3_ex2', definitionId: 'native_power', name: 'Native Power', costModifier: 1, isCustom: false },
          { id: 'immo_q3_ex3', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'immo_q3_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
          { id: 'immo_q3_fl2', definitionId: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, isCustom: false }, // Standard cost
          { id: 'immo_q3_fl3', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
          { id: 'immo_q3_fl4', definitionId: 'if_then', name: 'If/Then (Activates upon death)', costModifier: -1, isCustom: false },
          { id: 'immo_q3_fl5', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'immunity_type',
    name: 'Immunity (Type)',
    description: "You are immune to some unusual and otherwise dangerous substance or environment, such as radiation, viruses, suffocation, or something else. Consult with the GM and other players to decide what’s an appropriate scope for the power.\nImmunity does not protect you against ordinary attacks—at least, not without the Defends quality—but it protects you completely against Non-Physical (page 128) attacks that are based on the subject of your immunity. Immunity is usually taken with multiple Hard Dice to guarantee its effect at height 10.\nFor broad immunity you can add the Variable Effect Extra. With Immunity that has an ongoing effect due to Permanent, Endless or Duration, Variable Effect allows the power to adjust automatically to other sources of harm.",
    qualities: [
      {
        id: 'imm_q1_use', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'imm_q1_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'imm_q1_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'insubstantiality',
    name: 'Insubstantiality',
    description: "You can become completely immaterial, able to pass through solid objects like a ghost.\nWith Attacks you can “phase” into the same space as a target. As your bodies automatically separate the trauma causes width in Shock and Killing damage. (Presumably your power prevents you from taking the same damage; you can take Flaws to make it otherwise.) The Non-Physical Extra ignores armor and ordinary defenses; you should decide what kind of power or effect blocks damage from your Insubstantiality attack. For example, maybe the Hardened Defense Extra makes armor too dense for your attack to work.\nWith Defends you can go insubstantial to avoid attacks; once the power is activated, physical attacks can’t hurt you and you can’t hurt physical targets without becoming substantial again.\nWhile insubstantial you can speak, hear and see normally. If you want Insubstantiality to restrict your senses and speech, take a Flaw called “Out of Phase” for –1 for restricted speech and hearing, or –2 for restricted speech, hearing and sight (light passes right through your eyes!). You could also take a Flaw called “No Breath” for –1 that requires you to hold your breath while insubstantial.",
    qualities: [
      {
        id: 'insub_q1_atk', type: 'attacks', capacity: 'touch', levels: 0,
        extras: [
          { id: 'insub_q1_ex1', definitionId: 'non_physical', name: 'Non-Physical', costModifier: 2, isCustom: false }
        ],
        flaws: [
          { id: 'insub_q1_fl1', definitionId: 'touch_only', name: 'Touch Only', costModifier: -2, isCustom: false }
        ]
      },
      { id: 'insub_q2_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
      {
        id: 'insub_q3_use', type: 'useful', capacity: 'touch', levels: 1, // Useful (+1)
        extras: [],
        flaws: [
          { id: 'insub_q3_fl1', definitionId: 'touch_only', name: 'Touch Only', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'invisibility',
    name: 'Invisibility',
    description: "You can turn invisible. Ordinary sight just can’t see you. Anyone attempting to detect you with some means other than plain sight— making a Scrutiny or Perception roll to see your tracks or to smell your cologne, for instance—must make an opposed roll against your Invisibility dice pool. Being invisible you are rather hard to target, which is why your power reflexively defends you against all attacks once you activate it.\nTo make yourself invisible to some other senses besides sight, change this Miracle’s name to Inaudible or Unsmellable or whatever and remove the Defends quality (since being hard to smell doesn’t often make you any harder to hit).",
    qualities: [
      {
        id: 'invis_q1_def', type: 'defends', capacity: 'self', levels: 0,
        extras: [
          { id: 'invis_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
        ],
        flaws: []
      },
      {
        id: 'invis_q2_use', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'invis_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
        ],
        flaws: [
          { id: 'invis_q2_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'invulnerability',
    name: 'Invulnerability',
    description: "You are (mostly) impossible to harm. Invulnerability’s Useful quality protects you against some otherwise-deadly environment—radiation, vacuum, bitter cold, or something else—without harm. With Variable Effect and Permanent, it instantly adjusts to fit any dangerous environment.\nIn combat, each die of your Invulnerability roll removes one die from each attack against you. If an attack’s width is great enough to hit despite your power’s Interference dice, you have width in Hardened LAR against its damage.\nInvulnerability is usually taken with multiple Hard Dice to guarantee a static defence set at height 10.",
    qualities: [
      { // HAR
        id: 'invul_q1_def_har', type: 'defends', capacity: 'self', levels: 0,
        extras: [
          { id: 'invul_q1_ex1', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false },
          { id: 'invul_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: []
      },
      { // LAR
        id: 'invul_q2_def_lar', type: 'defends', capacity: 'self', levels: 0,
        extras: [
          { id: 'invul_q2_ex1', definitionId: 'hardened_defense', name: 'Hardened defence', costModifier: 2, isCustom: false },
          { id: 'invul_q2_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'invul_q2_fl1', definitionId: 'armored_defense', name: 'Armored defence', costModifier: -2, isCustom: false }
        ]
      },
      {
        id: 'invul_q3_use_immune', type: 'useful', capacity: 'self', levels: 0,
        extras: [
          { id: 'invul_q3_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false },
          { id: 'invul_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
        ],
        flaws: [
          { id: 'invul_q3_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false },
          { id: 'invul_q3_fl2', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false },
          { id: 'invul_q3_fl3', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for immunities)', costModifier: -1, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'jinx',
    name: 'Jinx',
    description: "You’re bad luck, at least for people you don’t like. Each die in your Jinx set removes one die of equal or lower height from the target’s roll. However, it costs you 1 Willpower per Jinx die thrown, 2 per Hard Die, and 4 per Wiggle Die.",
    qualities: [
      {
        id: 'jinx_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
        extras: [
          { id: 'jinx_q1_ex1', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false }
        ],
        flaws: [
          { id: 'jinx_q1_fl1', definitionId: 'if_then', name: 'If/Then (must use Interference)', costModifier: -1, isCustom: false },
          { id: 'jinx_q1_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
        ]
      },
      {
        id: 'jinx_q2_def', type: 'defends', capacity: 'self', levels: 0, // Base self, range is extra
        extras: [
          { id: 'jinx_q2_ex1', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false },
          { id: 'jinx_q2_ex2', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
        ],
        flaws: [
          { id: 'jinx_q2_fl1', definitionId: 'if_then', name: 'If/Then (must use Interference)', costModifier: -1, isCustom: false },
          { id: 'jinx_q2_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
        ]
      },
      {
        id: 'jinx_q3_use', type: 'useful', capacity: 'range', levels: 0,
        extras: [
          { id: 'jinx_q3_ex1', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false }
        ],
        flaws: [
          { id: 'jinx_q3_fl1', definitionId: 'if_then', name: 'If/Then (must use Interference)', costModifier: -1, isCustom: false },
          { id: 'jinx_q3_fl2', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
        ]
      }
    ]
  },
  {
    definitionId: 'light_armour',
    name: 'Light Armour',
    description: "You gain width in LAR. You can increase the LAR by taking additional Defends Power Quality Levels.\nTo be able to turn on your armor every time, without fail, always with the same effect, take two or more Hard Dice in Light Armor. For armor that you don’t even need to activate, take Hard Dice and change Endless to the Permanent Extra.\nFor attacks that pierce armor easily due to the Penetration Extra, you may need to add the Hardened defence Extra (page 126).",
    qualities: [
        {
            id: 'la_q1_def', type: 'defends', capacity: 'self', levels: 0,
            extras: [
                { id: 'la_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false }
            ],
            flaws: [
                { id: 'la_q1_fl1', definitionId: 'armored_defense', name: 'Armored defence', costModifier: -2, isCustom: false }
            ]
        }
    ]
  },
   {
    definitionId: 'lightning_reflexes',
    name: 'Lightning Reflexes',
    description: "When you use this power, you can increase the speed of any action. Use the smaller of your normal dice pool or your Lightning Reflexes power. If you get a set, it resolves as if its width was 4 points greater for the purpose of initiative only.\nThe other element of acting quickly is being able to size up your environment. This comes down to the Sense stat, which can be improved as a Hyperstat. It may be a good idea generally to buy Hypersense with the flaw If/Then (only to determine declaration order), so that your speedster can see what everyone else declares in combat before deciding what he wants to do.",
    qualities: [
        {
            id: 'lr_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'lr_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'lr_q1_ex2', definitionId: 'go_first', name: 'Go First x4', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'lr_q1_fl1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: -1, isCustom: false },
                { id: 'lr_q1_fl2', definitionId: 'if_then', name: 'If/Then (only to add Extras)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'lr_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'lr_q2_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'lr_q2_ex2', definitionId: 'go_first', name: 'Go First x4', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'lr_q2_fl1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: -1, isCustom: false },
                { id: 'lr_q2_fl2', definitionId: 'if_then', name: 'If/Then (only to add Extras)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'lr_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'lr_q3_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'lr_q3_ex2', definitionId: 'go_first', name: 'Go First x4', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'lr_q3_fl1', definitionId: 'if_then', name: 'If/Then (only for Augment)', costModifier: -1, isCustom: false },
                { id: 'lr_q3_fl2', definitionId: 'if_then', name: 'If/Then (only to add Extras)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'lycanthropy',
    name: 'Lycanthropy',
    description: "The power requires the character to have Mutable. Upon a succesful bite attack, this power can be optionally rolled to induce Lycanthropy in the victim. Enabling them to become a mighty Werewolf. This requires the purchase of the following:\nSource: Paranormal{}[5(0 if first power source)]\nPermission: Inhuman Stats(Body 10, Sense 10, Mind 3){}[4]\nPermission: Power Theme(Werewolf){}[5]\nIntrinsic: Allergy(Silver(Touch)){}[-3]\nIntrinsic: Mutable{}[15]\nTotal cost is 1 Base Will and 21 Willpower for the archetype.\n2 dice in Alternate Forms (with the Uncontrollable flaw) and Lycanthropy must also be bought, which costs another 6 willpower and 4 willpower, respectively. The character is then free to buy hyper stats, hyper skills, and miracles that fit the Werewolf power theme. Why would they do this? Simply to prolong their cursed life. After all, if you turn into a bloodthirsty hunter every full moon, would you rather be one that is a successful hunter, or one that gets killed at the first opportunity?",
    qualities: [
        {
            id: 'lyc_q1_use', type: 'useful', capacity: 'self', levels: 0,
            extras: [
                { id: 'lyc_q1_ex1', definitionId: 'native_power', name: 'Native Power', costModifier: 1, isCustom: false },
                { id: 'lyc_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'lyc_q1_fl1', definitionId: 'attached_specific', name: 'Attached (Hyperskill(Brawling))', costModifier: -2, isCustom: false }, // Assuming a Brawling hyperskill exists
                { id: 'lyc_q1_fl2', definitionId: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, isCustom: false }, // Standard cost
                { id: 'lyc_q1_fl3', definitionId: 'if_then', name: 'If/Then (Requires Mutable)', costModifier: -1, isCustom: false }, // Assuming -1 for this common If/Then
                { id: 'lyc_q1_fl4', definitionId: 'if_then', name: 'If/Then (Must have dealt damage)', costModifier: -1, isCustom: false },
                // Willpower Cost (+0) ignored, use standard if any or omit
            ]
        }
    ]
  },
  {
    definitionId: 'master_plan',
    name: 'Master Plan',
    description: "Once per scene, you can add your dice in Master Plan to a single roll made by you or an ally within range. If the roll fails, you are slightly demoralized and lose 1 Willpower.",
    qualities: [
        {
            id: 'mp_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
            extras: [
                { id: 'mp_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false }, // "Augments" likely means Augment
                { id: 'mp_q1_ex2', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'mp_q1_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false },
                { id: 'mp_q1_fl2', definitionId: 'if_then', name: 'If/Then (Only for Augment)', costModifier: -1, isCustom: false },
                { id: 'mp_q1_fl3', definitionId: 'willpower_bid', name: 'Willpower Bid', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'mp_q2_def', type: 'defends', capacity: 'range', levels: 0,
            extras: [
                { id: 'mp_q2_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'mp_q2_ex2', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'mp_q2_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false },
                { id: 'mp_q2_fl2', definitionId: 'if_then', name: 'If/Then (Only for Augment)', costModifier: -1, isCustom: false },
                { id: 'mp_q2_fl3', definitionId: 'willpower_bid', name: 'Willpower Bid', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'mp_q3_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'mp_q3_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'mp_q3_ex2', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'mp_q3_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false },
                { id: 'mp_q3_fl2', definitionId: 'if_then', name: 'If/Then (Only for Augment)', costModifier: -1, isCustom: false },
                { id: 'mp_q3_fl3', definitionId: 'willpower_bid', name: 'Willpower Bid', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'medium_armour',
    name: 'Medium Armour',
    description: "Rather than reducing the width of the actual attack roll, each rank of Medium Armor blocks 1 Shock and 1 Killing from the attack. Where one level of Heavy Armor is enough to completely block any attack with width 2, one level of Medium Armor would simply reduce the damage. Each level of Penetration in an attack reduces Medium Armor by one point. Unlike Light Armor, which always leaves at least one point of Shock damage, Medium Armor can reduce an attack’s damage to zero.",
    qualities: [
        {
            id: 'ma_q1_def', type: 'defends', capacity: 'self', levels: 0,
            extras: [
                { id: 'ma_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
                { id: 'ma_q1_ex2', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false }
            ],
            flaws: [
                { id: 'ma_q1_fl1', definitionId: 'armored_defense', name: 'Armored defence', costModifier: -2, isCustom: false },
                { id: 'ma_q1_fl2', name: 'Medium Armour Flaw', costModifier: -1, isCustom: true } // Custom flaw as per text
            ]
        }
    ]
  },
  {
    definitionId: 'mind_control',
    name: 'Mind Control',
    description: "You can control the target’s behavior for the power’s duration (that’s one round unless you take the Duration or Endless Extra). The target can oppose your power’s roll with a Stability Skill roll. After the first round, the target can get another attempt to throw off your power with a Stability roll by spending a point of Willpower or Base Will.\nNote that this power does not allow you to read minds, only control them, and you must speak to the target and be understood. To read the target’s mind or send signals telepathically, buy a separate power or add another Useful quality to this power.",
    qualities: [
      { id: 'mc_q1_use', type: 'useful', capacity: 'range', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'minions',
    name: 'Minions',
    description: "You summon a group of minions (see page 75) to do your bidding. The height of your roll determines their quality rating: At height 1–3 they’re rabble, at height 4–6 they’re trained, at height 7–8 they’re professional, and at height 9–10 they’re expert. The minions have no armor or weapons.\nYou summon a number of minions equal to the size of your dice pool. The type of dice doesn’t matter, only the number; with 10d, 10hd or 10wd you summon 10 minions.\nAfter you summon the minions, they act each turn separately from you for the duration of your power using the standard minion rules. To miraculously create a private standing army, replace the Duration Extra with Permanent and use the power as many times as you need.\nWhatever form they take—scaly demons or human beings teleported into place from elsewhere—summoned minions speak some language that you speak, but they are not mindless slaves; they are their own characters. If you have this power, presumably you’ve worked out some kind of deal ahead of time with the minions so they’ll follow your orders and fight on your behalf. If not, they won’t fight on your behalf without motivation, which makes them very difficult to use if you summon them the first time in the middle of combat. A power like Mind Control might be handy.\n(Although you could make them mindless slaves with a separate Useful quality that’s Attached to the main “minions” quality.)\nIf you want minions with strange powers, take the powers as separate Power Qualities or separate powers entirely and link them to Minions with the Attached Flaw. Those are powers that only the minions can use.",
    qualities: [
        {
            id: 'min_q1_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'min_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'multiple_actions',
    name: 'Multiple Actions',
    description: "On activation, this power adds it's dice pool to any stat or skill for the duration of the scene. These dice can only be used to remove penalty dice created by multiple actions, or to reduce the time taken to carry out an action. They can not be used to increase damage.\nIf for any reason this power is deactivated, it cannot be reactivated until the scene is over.",
    qualities: [
        {
            id: 'mact_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'mact_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'mact_q1_ex2', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'mact_q1_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false },
                { id: 'mact_q1_fl2', definitionId: 'if_then', name: 'If/Then (must announce in the declare phase)', costModifier: -1, isCustom: false },
                { id: 'mact_q1_fl3', definitionId: 'if_then', name: 'If/Then (Augment only for Multiple Actions, or Go First)', costModifier: -1, isCustom: false },
                { id: 'mact_q1_fl4', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'mact_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'mact_q2_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'mact_q2_ex2', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'mact_q2_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false },
                { id: 'mact_q2_fl2', definitionId: 'if_then', name: 'If/Then (must announce in the declare phase)', costModifier: -1, isCustom: false },
                { id: 'mact_q2_fl3', definitionId: 'if_then', name: 'If/Then (Augment only for Multiple Actions, or Go First)', costModifier: -1, isCustom: false },
                { id: 'mact_q2_fl4', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'mact_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'mact_q3_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'mact_q3_ex2', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'mact_q3_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false },
                { id: 'mact_q3_fl2', definitionId: 'if_then', name: 'If/Then (must announce in the declare phase)', costModifier: -1, isCustom: false },
                { id: 'mact_q3_fl3', definitionId: 'if_then', name: 'If/Then (Augment only for Multiple Actions, or Go First)', costModifier: -1, isCustom: false },
                { id: 'mact_q3_fl4', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false },
                { id: 'mact_q3_fl5', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'nullify_type',
    name: 'Nullify (Type)',
    description: "This ranged power disrupts one particular Archetype Source on a targeted character. The target loses all powers that come from that Source and its Permissions. The target can attempt to avoid Nullify with a defence roll as if you were attacking.\nTo restrict Nullify to a single power within a particular Source, take the If/Then Flaw. To allow Nullify to apply to a range of Sources, take the Variable Effect Extra.\nBecause nullification is such a sweeping, restrictive action, it automatically incurs a Willpower cost (see page 116): You must spend 1 Willpower per die, 2 per Hard Die, and 4 per Wiggle Die that you roll. When the nullification fades and the target’s powers return, you get the Willpower back.\nIf your game does not use Archetype Sources, Nullification simply removes all a target’s Hyper Stats, Hyper Skills and Miracles.",
    qualities: [
        {
            id: 'null_q1_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'null_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: [
                // Willpower Cost (0) - This is explicitly a Willpower Cost per rules on pg 116, not a Flaw to reduce Miracle cost.
                // The description notes "it automatically incurs a Willpower cost". This isn't a flaw but a rule.
            ]
        }
    ]
  },
  {
    definitionId: 'omni_competence',
    name: 'Omni-Competence',
    description: "With a successful activation, you can assign dice from Omni-Competence to any skill. Activating this power costs 1 Willpower per normal die, 2 per Hard Die, and 4 per Wiggle Die.",
    qualities: [
        {
            id: 'omni_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'omni_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
                { id: 'omni_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'omni_q1_fl1', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'omni_q1_fl2', definitionId: 'if_then', name: 'If/Then (Only to mimic mundane skills)', costModifier: -1, isCustom: false },
                { id: 'omni_q1_fl3', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
            ]
        },
        {
            id: 'omni_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'omni_q2_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
                { id: 'omni_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'omni_q2_fl1', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'omni_q2_fl2', definitionId: 'if_then', name: 'If/Then (Only to mimic mundane skills)', costModifier: -1, isCustom: false },
                { id: 'omni_q2_fl3', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
            ]
        },
        {
            id: 'omni_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'omni_q3_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
                { id: 'omni_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'omni_q3_fl1', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'omni_q3_fl2', definitionId: 'if_then', name: 'If/Then (Only to mimic mundane skills)', costModifier: -1, isCustom: false },
                { id: 'omni_q3_fl3', definitionId: 'willpower_cost', name: 'Willpower Cost', costModifier: -2, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'paradox_machine',
    name: 'Paradox Machine',
    description: "Absorb Energy lets you drain the energy out of anything or anyone you touch. This can protect you from attack once you have activated the effect. In addition, you can impede non-combat actions by touching the target and draining energy.",
    qualities: [
        { // Paradox Energy Absorption
            id: 'para_q1_use_absorb', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'para_q1_ex1', definitionId: 'booster', name: 'Booster x10 (Range)', costModifier: 10, isCustom: false }, // Assuming linear scaling for x10
                { id: 'para_q1_ex2', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false },
                { id: 'para_q1_ex3', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'para_q1_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
                { id: 'para_q1_fl2', definitionId: 'if_then', name: 'If/Then (Only paradoxical energy)', costModifier: -1, isCustom: false },
                { id: 'para_q1_fl3', definitionId: 'focus', name: 'Focus (Bulky, Environment Bound, Immutable, Indestructible, Irreplaceable, Operational Skill, Unwieldy 1)', costModifier: -5, isCustom: false } // Using specific cost
            ]
        },
        { // Paradox Battery
            id: 'para_q2_use_battery', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'para_q2_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'para_q2_fl1', definitionId: 'always_on', name: 'Always On', costModifier: -1, isCustom: false },
                { id: 'para_q2_fl2', definitionId: 'focus', name: 'Focus (Bulky, Environment Bound, Immutable, Indestructible, Irreplaceable, Operational Skill, Unwieldy 1)', costModifier: -5, isCustom: false }
            ]
        },
        { // Create paradoxical effects
            id: 'para_q3_use_create', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'para_q3_ex1', definitionId: 'booster', name: 'Booster x10 (Range)', costModifier: 10, isCustom: false },
                { id: 'para_q3_ex2', definitionId: 'subtle', name: 'Subtle', costModifier: 1, isCustom: false },
                { id: 'para_q3_ex3', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false },
                { id: 'para_q3_ex4', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Mass)', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'para_q3_fl1', definitionId: 'if_then', name: 'If/Then (Only paradoxical energy)', costModifier: -1, isCustom: false },
                { id: 'para_q3_fl2', definitionId: 'uncontrollable', name: 'Uncontrollable', costModifier: -2, isCustom: false }, // text says -3, but predefined is -2
                { id: 'para_q3_fl3', name: "'Charges'", costModifier: -1, isCustom: true },
                { id: 'para_q3_fl4', definitionId: 'focus', name: 'Focus (Bulky, Environment Bound, Immutable, Indestructible, Irreplaceable, Operational Skill, Unwieldy 1)', costModifier: -5, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'perceive_godlike_talents',
    name: 'Perceive (Godlike Talents)',
    description: "Talents from Godlike are humans with the peculiar ability to change reality with the power of their minds alone. They possess several unique abilities and limitations—such as the ability to detect and resist the powers of others of their kind. There is no physiological aspect to the phenomena; they are wholly psychic in nature.\nIn Godlike, Talents are usually built on 25 Points with normal Stats and Skills provided free. Using Wild Talents rules such characters are built on 125 Points.\n\nFor postwar Wild Talents in the Godlike world, build them normally without this Archetype. You can pick or create any other Archetype you like; they have transcended the limitations of their predecessors and are now truly superhuman.",
    qualities: [
        {
            id: 'pgt_q1_use',
            type: 'useful',
            capacity: 'range',
            levels: 0,
            extras: [],
            flaws: [
                { id: 'pgt_q1_fl1', definitionId: 'see_it_first', name: 'See It First', costModifier: PREDEFINED_FLAWS.find(f=>f.id==='see_it_first')!.costModifier, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'perceive_type',
    name: 'Perceive (Type)',
    description: "You can perceive or detect stimuli outside the range of human awareness. You can use Perceive just like making a Sense Skill roll, such as Perception or Scrutiny, but use your Perceive dice pool instead of your Stat and Skill dice.\nPerceive, by default, lets you perceive one particular kind of stimulus, whether it’s infrared light, X rays, life forms, gravity, magnetism, powers, or whatever. For a particular broad perception—“all spectra of light,” say—you may need to add the Variable Effect or another Useful quality. Work with the GM and other players to determine the appropriate scope and cost of your power. For a particular narrow power take the If/Then Flaw.",
    qualities: [
      { id: 'perc_q1_use', type: 'useful', capacity: 'range', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'plot_device_psychic',
    name: 'Plot-Device Psychic',
    description: "Real pain and fake pain can be caused using the two attack qualities. Plain ranged defence and a variable effect useful quality. He can do just about everything with the Useful quality.",
    qualities: [
        { // Psychic Bolts
            id: 'pdp_q1_atk_bolts', type: 'attacks', capacity: 'range', levels: 0,
            extras: [],
            flaws: []
        },
        { // Pain Attack
            id: 'pdp_q2_atk_pain', type: 'attacks', capacity: 'range', levels: 0,
            extras: [
                { id: 'pdp_q2_ex1', definitionId: 'non_physical', name: 'Non-Physical (Sense + Perception)', costModifier: 2, isCustom: false } // Assuming standard Non-Physical
            ],
            flaws: [
                { id: 'pdp_q2_fl1', definitionId: 'limited_damage', name: 'Limited Damage (Shock)', costModifier: -1, isCustom: false },
                { id: 'pdp_q2_fl2', definitionId: 'no_physical_change', name: 'No Physical Change', costModifier: -1, isCustom: false },
                { id: 'pdp_q2_fl3', definitionId: 'if_then', name: 'If/Then (Doesn’t Work On Telepaths)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'pdp_q3_def', type: 'defends', capacity: 'range', levels: 0,
            extras: [],
            flaws: []
        },
        {
            id: 'pdp_q4_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'pdp_q4_ex1', definitionId: 'booster', name: 'Booster', costModifier: 1, isCustom: false }, // Text says +2, assuming this is total cost not levels.
                { id: 'pdp_q4_ex2', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
                { id: 'pdp_q4_ex3', definitionId: 'no_upward_limit', name: 'No Upward Limit', costModifier: 2, isCustom: false },
                { id: 'pdp_q4_ex4', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pdp_q4_fl1', definitionId: 'no_physical_change', name: 'No Physical Change', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'portal',
    name: 'Portal',
    description: "Opens a portal between the user and the maximum range capacity rolled. It will allow the designated mass to pass through it, remaining open for as long as the user desires.",
    qualities: [
        {
            id: 'port_q1_use', type: 'useful', capacity: 'mass', levels: 0, // Base mass, range added
            extras: [
                { id: 'port_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false },
                { id: 'port_q1_ex2', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
            ],
            flaws: [
                // Willpower Cost (0), Willpower Investment (0) - These are rules, not cost-reducing flaws.
            ]
        }
    ]
  },
  {
    definitionId: 'power_mimic',
    name: 'Power Mimic',
    description: "By touching another character, with a successful roll you can temporarily copy their powers. Use the Variable Effect Extra to “transfer” each die of a Power Mimic quality to a separate power for the duration, and spend Willpower to gain new Extras and Power Quality Levels, such as increased damage or protection. You must mimic the copied powers, however. You can’t take Extras or powers that the subject doesn’t have, and you must take all Flaws on the copied powers. If you have fewer Power Mimic dice than the subject has dice in powers, you can “copy” power dice up to your Power Mimic limit.",
    qualities: [
        {
            id: 'pm_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'pm_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'pm_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pm_q1_fl1', definitionId: 'if_then', name: 'If/Then (must touch subject)', costModifier: -1, isCustom: false },
                { id: 'pm_q1_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect must match subject’s powers)', costModifier: -1, isCustom: false },
                { id: 'pm_q1_fl3', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'pm_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'pm_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'pm_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pm_q2_fl1', definitionId: 'if_then', name: 'If/Then (must touch subject)', costModifier: -1, isCustom: false },
                { id: 'pm_q2_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect must match subject’s powers)', costModifier: -1, isCustom: false },
                { id: 'pm_q2_fl3', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'pm_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'pm_q3_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'pm_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pm_q3_fl1', definitionId: 'if_then', name: 'If/Then (must touch subject)', costModifier: -1, isCustom: false },
                { id: 'pm_q3_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect must match subject’s powers)', costModifier: -1, isCustom: false },
                { id: 'pm_q3_fl3', definitionId: 'if_then', name: 'If/Then (only for Variable Effect)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'precognition',
    name: 'Precognition',
    description: "You can tell the future. With a successful roll you can get an answer to a single question about the future. The higher you roll, the more precise and detailed your vision. Here are some guidelines for the result of your roll.\nFailure: You get a sense of the future that may or may not be accurate.\nSuccess: A brief but accurate vision.\nWidth 3+: Knowledge of some amount of time (up to the GM) before a certain event occurs.\nHeight 7+: Knowledge of who exactly is involved in a certain event.\nWidth 3+ and height 7+: A vision with both timing and subjects clearly shown.\nWidth 3+ and height 10: An extremely clear vision of the future, as if you had lived the moment already, with all senses represented.\nThe results of this power are always up to the GM. If you take the Endless or Permanent Extra, the GM may supply you with visions or epiphanies in dreams or meditation, or when you come near some place that may be important in the future.\nIf you add the Attacks quality, your precognitive power somehow inflicts harm on others. Maybe it allows you to manipulate probabilities so that debris falls on an opponent, or maybe it’s simply a magical force that lashes out. The details are up to you.\nBecause Precognition affects the future—in game terms, you define the future by predicting it—it costs 1 Willpower per die you roll, 2 per Hard Die, and 4 per Wiggle Die.",
    qualities: [
      { id: 'precog_q1_use', type: 'useful', capacity: 'range', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'pre_emptive_action',
    name: 'Pre-Emptive Action',
    description: "The user rolls the power and stores away dice. The action is limited by the location of the attack or block. For instance, a defends roll of this power that rolls as 2x1s, will only block that leg, at a width of 2, and nothing more. The if/then states that this can be delayed until it's needed, providing there is still room for the required width (If you have a width 3 action, the maximum you can roll that turn and still use is 7 dice).",
    qualities: [
        {
            id: 'pea_q1_atk', type: 'attacks', capacity: 'range', levels: 0, // Or mass
            extras: [
                { id: 'pea_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'pea_q1_ex2', definitionId: 'spray', name: 'Spray', costModifier: 1, isCustom: false }
            ],
            flaws: [
                { id: 'pea_q1_fl1', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
                { id: 'pea_q1_fl2', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'pea_q2_def', type: 'defends', capacity: 'self', levels: 0,
            extras: [
                { id: 'pea_q2_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false },
                { id: 'pea_q2_ex2', definitionId: 'spray', name: 'Spray', costModifier: 1, isCustom: false }
            ],
            flaws: [
                { id: 'pea_q2_fl1', definitionId: 'delayed_effect', name: 'Delayed Effect', costModifier: -2, isCustom: false },
                { id: 'pea_q2_fl2', definitionId: 'willpower_investment', name: 'Willpower Investment', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'psychic_artifacts',
    name: 'Psychic Artifacts',
    description: "You can create immaterial objects with all kinds of functions. Use the Variable Effect Extra to determine the exact qualities of the object you’re creating.",
    qualities: [
        {
            id: 'pa_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'pa_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'pa_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pa_q1_fl1', definitionId: 'obvious', name: 'Obvious', costModifier: -1, isCustom: false },
                { id: 'pa_q1_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for artifacts)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'pa_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'pa_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'pa_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pa_q2_fl1', definitionId: 'obvious', name: 'Obvious', costModifier: -1, isCustom: false },
                { id: 'pa_q2_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for artifacts)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'pa_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'pa_q3_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'pa_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'pa_q3_fl1', definitionId: 'obvious', name: 'Obvious', costModifier: -1, isCustom: false },
                { id: 'pa_q3_fl2', definitionId: 'if_then', name: 'If/Then (Variable Effect is only for artifacts)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'pyrokinesis',
    name: 'Pyrokinesis',
    description: "You attack your target by increasing its internal temperature greatly, causing it to spontaneously combust. This deals WSK to each hit location and sets the target on fire. This effect ignores armor, but it can be resisted with an Endurance roll.",
    qualities: [
        {
            id: 'pyro_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
            extras: [
                { id: 'pyro_q1_ex1', definitionId: 'burn', name: 'Burn', costModifier: 2, isCustom: false }, // text says Burns (+2)
                { id: 'pyro_q1_ex2', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
                { id: 'pyro_q1_ex3', definitionId: 'non_physical', name: 'Non-Physical', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'puppet',
    name: 'Puppet',
    description: "By overcoming another character’s Stability roll you can switch minds, taking over the target’s body and using all of its senses. The target’s mind goes unconscious as long as you’re using his or her body, as does your own body. After the first round, the target can make another attempt to roll Stability to throw off your control by spending a point of Willpower or Base Will.\nNote that this power does not allow you to read the target’s mind; for that ability buy a separate power or add another Useful quality to this power.",
    qualities: [
        {
            id: 'pup_q1_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'pup_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'regeneration',
    name: 'Regeneration',
    description: "With a successful roll you instantly heal width in Shock and Killing damage from every hit location. Thanks to the Permanent Extra Regeneration rolls automatically each round that you have an injured hit location.\nIf you remove the Self Only Flaw, you could apply your Regeneration power to another person instead of yourself. (See Healing, page 147.)\nTo be able to heal diseases or toxins that don’t inflict physical damage, take a separate Useful quality.",
    qualities: [
        {
            id: 'regen_q1_use', type: 'useful', capacity: 'self', levels: 0,
            extras: [
                { id: 'regen_q1_ex1', definitionId: 'engulf', name: 'Engulf', costModifier: 2, isCustom: false },
                { id: 'regen_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'regen_q1_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'sidekick',
    name: 'Sidekick',
    description: "You can manifest an entity that acts on its own volition. This sidekick uses your Sense and Mind Stats to perceive the world and think for itself, but it has no Skills. It cannot interact with the physical world but can observe and can pass through solid objects and barriers.\nAny successful attack dissipates the sidekick—it has no wound boxes—but its Defends quality allows it to make defence rolls to avoid harm.\nTo allow it to interact with the physical world add the Attacks quality and the Power Capacity (Mass) Extra; to give it Skills or powers use the Variable Effect Extra to “transfer” dice from Sidekick. To allow it to stand up to punishment give it the Armored defence Flaw on Defends or wound boxes with the Extra Tough Miracle.",
    qualities: [
        { id: 'side_q1_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
        {
            id: 'side_q2_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'side_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'share_skill',
    name: 'Share Skill',
    description: "You can mimic a skill possessed by any individual within 10 yards. You can only share one skill at a time, and you share it at the lower of your dice in Share Skill and the highest pool possessed by individuals in the area.",
    qualities: [
        {
            id: 'ss_q1_atk', type: 'attacks', capacity: 'range', levels: 0, // Radius is an extra
            extras: [
                { id: 'ss_q1_ex1', definitionId: 'radius', name: 'Radius', costModifier: 2, isCustom: false },
                { id: 'ss_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ss_q1_fl1', definitionId: 'full_power_only', name: 'Full Power Only', costModifier: -1, isCustom: false },
                { id: 'ss_q1_fl2', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'ss_q1_fl3', definitionId: 'if_then', name: 'If/Then (Only for hyper skills)', costModifier: -1, isCustom: false },
                { id: 'ss_q1_fl4', definitionId: 'if_then', name: 'If/Then (Limited to greatest pool of any character in Radius)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'ss_q2_def', type: 'defends', capacity: 'range', levels: 0,
            extras: [
                { id: 'ss_q2_ex1', definitionId: 'radius', name: 'Radius', costModifier: 2, isCustom: false },
                { id: 'ss_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ss_q2_fl1', definitionId: 'full_power_only', name: 'Full Power Only', costModifier: -1, isCustom: false },
                { id: 'ss_q2_fl2', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'ss_q2_fl3', definitionId: 'if_then', name: 'If/Then (Only for hyper skills)', costModifier: -1, isCustom: false },
                { id: 'ss_q2_fl4', definitionId: 'if_then', name: 'If/Then (Limited to greatest pool of any character in Radius)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'ss_q3_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [
                { id: 'ss_q3_ex1', definitionId: 'radius', name: 'Radius', costModifier: 2, isCustom: false },
                { id: 'ss_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ss_q3_fl1', definitionId: 'full_power_only', name: 'Full Power Only', costModifier: -1, isCustom: false },
                { id: 'ss_q3_fl2', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'ss_q3_fl3', definitionId: 'if_then', name: 'If/Then (Only for hyper skills)', costModifier: -1, isCustom: false },
                { id: 'ss_q3_fl4', definitionId: 'if_then', name: 'If/Then (Limited to greatest pool of any character in Radius)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'size_shift',
    name: 'Size Shift',
    description: "You can either increase or decrease your size; choose one. (To do both, take them as separate Useful qualities.) When you activate this power you can double your mass or halve it, and each point of width beyond 2 allows you to double or halve your mass again. You can add the Booster Extra (or No Upward Limit) to Size Shift’s Useful quality to increase or reduce it further.\nSize Shift increases or decreases your height as well, but not as dramatically as mass. For each eight times your mass goes up (or down), your height doubles (or halves).\nIf you’re smaller you’re harder to hit, while if you’re larger you can absorb more punishment. This is reflected in the Permanent Defends quality, which gives you an automatic defence each round. For growth, you may want to take the Armored defence Flaw so it simply gives you an armor rating.\nTo have Size Shift affect only mass or height, apply a (–1) If/Then Flaw to its Useful quality. If you want to change others’ size, remove the Self Only Flaw. To increase your strength when you grow, take Hyperbody with the Flaw Attached to Size Shift.",
    qualities: [
        {
            id: 'ssh_q1_def', type: 'defends', capacity: 'self', levels: 0,
            extras: [
                { id: 'ssh_q1_ex1', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ssh_q1_fl1', definitionId: 'attached_specific', name: 'Attached (Useful quality)', costModifier: -2, isCustom: false }
            ]
        },
        {
            id: 'ssh_q2_use', type: 'useful', capacity: 'mass', levels: 0,
            extras: [
                { id: 'ssh_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'ssh_q2_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'sunday_punch',
    name: 'Sunday Punch',
    description: "",
    qualities: [
        {
            id: 'sp_q1_atk', type: 'attacks', capacity: 'mass', levels: 0,
            extras: [
                { id: 'sp_q1_ex1', definitionId: 'go_first', name: 'Go First x5', costModifier: 5, isCustom: false },
                { id: 'sp_q1_ex2', definitionId: 'non_physical', name: 'Non-Physical', costModifier: 2, isCustom: false }
            ],
            flaws: [
                { id: 'sp_q1_fl1', definitionId: 'exhausted', name: 'Exhausted', costModifier: -3, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'suppress_nuclear_fusion',
    name: 'Suppress Nuclear Fusion',
    description: "With a successful roll, you can suppress nuclear fusion. With the Duration Extra this lasts for the length of one encounter, or for a few minutes. To increase the duration, replace the Duration Extra with Endless or Permanent.",
    qualities: [
        {
            id: 'snf_q1_use', type: 'useful', capacity: 'mass', levels: 0, // Base mass, range added by extra
            extras: [
                { id: 'snf_q1_ex1', definitionId: 'booster', name: 'Booster (Mass) X26', costModifier: 26, isCustom: false },
                { id: 'snf_q1_ex2', definitionId: 'booster', name: 'Booster (Range) X10', costModifier: 10, isCustom: false },
                { id: 'snf_q1_ex3', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'snf_q1_ex4', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'telekinesis',
    name: 'Telekinesis',
    description: "You can move objects at a distance with the power of your mind. Telekinesis has the range capacity by default; the Power Capacity (Mass) Extra allows it to manipulate mass as well. With the Attacks quality you can slam targets around for width in Shock and Killing damage; with Defends you can deflect attacks or throw off an enemy’s aim.",
    qualities: [
        {
            id: 'tk_q1_atk', type: 'attacks', capacity: 'range', levels: 0, // Base range, mass added
            extras: [
                { id: 'tk_q1_ex1', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Mass)', costModifier: 2, isCustom: false }
            ],
            flaws: []
        },
        { id: 'tk_q2_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] },
        {
            id: 'tk_q3_use', type: 'useful', capacity: 'range', levels: 0, // Base range, mass added
            extras: [
                { id: 'tk_q3_ex1', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Mass)', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'telepathy',
    name: 'Telepathy',
    description: "You can read minds. If the target is unaware of your attempt or explicitly unwilling, your Miracle’s roll must beat the target’s Stability roll in a contest. If you use Telepathy to attack, you inflict terrible pain and psychosomatic spasms for width in Shock and Killing damage. Armor does not block this damage, and it can be avoided only with a Stability Skill roll, not a typical defence or dodge roll. Telepathy’s Defends quality allows you to detect hostile intentions early enough to avoid them.\nWith an additional Useful quality, you can use Telepathy to change or even erase memories indefinitely. This costs Willpower, and your roll must beat the victim’s Stability roll. The victim can only gain the lost memories back if another telepath uncovers them, or if some other factor triggers their recovery. If you spend a point of Base Will when you erase the memory, however, the memory will be gone forever.",
    qualities: [
        {
            id: 'tpath_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
            extras: [
                { id: 'tpath_q1_ex1', definitionId: 'non_physical', name: 'Non-Physical', costModifier: 2, isCustom: false }
            ],
            flaws: []
        },
        { id: 'tpath_q2_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] }, // Self for detecting intentions
        { id: 'tpath_q3_use', type: 'useful', capacity: 'range', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'teleportation',
    name: 'Teleportation',
    description: "You can move instantaneously from one point in space to another, without physically crossing the space in between. The range of your Teleportation power determines how far you can teleport. With the Attacks quality, you can teleport into the same space as a target; as your bodies force each other apart and back to normal, the trauma causes width in Shock and Killing damage. (Presumably your power prevents you from taking the same damage; you can take Flaws to make it otherwise.) With the defends quality, you can “blink” teleport a few inches out of the way of an attack. To be able to carry additional things with you when you teleport, add the Power Capacity (Mass) Extra.",
    qualities: [
        {
            id: 'tport_q1_atk', type: 'attacks', capacity: 'range', levels: 0,
            extras: [],
            flaws: [
                // Willpower Cost (0) - not a flaw for cost reduction
            ]
        },
        {
            id: 'tport_q2_def', type: 'defends', capacity: 'self', levels: 0, // "Blink" implies self
            extras: [],
            flaws: [
                // Willpower Cost (0)
            ]
        },
        {
            id: 'tport_q3_use', type: 'useful', capacity: 'range', levels: 0,
            extras: [],
            flaws: [
                // Willpower Cost (0)
            ]
        }
    ]
  },
  {
    definitionId: 'time_fugue',
    name: 'Time Fugue',
    description: "You can freeze time for a particular target. Your Time Fugue roll uses Interference to remove dice from the target’s rolls for the power’s duration; if the target has no sets, he or she can take no actions and stands stock still as time seems to pass normally all around.\nIf you want your power to have a broader effect than just slowing down a single target—it lets you redo the previous round of action, say, or go back in time—take a separate Useful quality with that effect. For Time Fugue to have such drastic effects on the game work it costs Willpower to use: 1 per die, 2 per Hard Die and 4 per Wiggle Die you roll.",
    qualities: [
        { id: 'tfug_q1_def', type: 'defends', capacity: 'self', levels: 0, extras: [], flaws: [] }, // Implied, though text focuses on Useful
        {
            id: 'tfug_q2_use', type: 'useful', capacity: 'mass', levels: 0, // Base mass, range added
            extras: [
                { id: 'tfug_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'tfug_q2_ex2', definitionId: 'interference', name: 'Interference', costModifier: 3, isCustom: false },
                { id: 'tfug_q2_ex3', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'time_travel',
    name: 'Time Travel',
    description: "You are able to travel forwards and backwards in time. You may not travel to anywhere you already exist, and it is notably more costly to travel backwards in time than it is forwards. The events that have passed are already somewhat cemented and so are less willing to change.\nWith Hard Dice you are limited to the exact increment of Time of your activation width, but with the regular and wiggle dice, you may travel a fraction of the activation increment.\nFor example: 5 HD would allow the character to travel exactly 1 day forwards/ backwards in time. Whereas 5WD could be set at any fraction of that day. Want to travel 12 hours forwards/ backwards? That’s height 5.",
    qualities: [ // FORWARDS
        {
            id: 'tt_fwd_q1_atk', type: 'attacks', capacity: 'range', levels: 0, extras: [],
            flaws: [
                { id: 'tt_fwd_q1_fl1', definitionId: 'if_then', name: 'If/Then (Cannot travel somewhere you already exist)', costModifier: -1, isCustom: false },
                // Willpower Cost (0) - not a flaw
            ]
        },
        {
            id: 'tt_fwd_q2_def', type: 'defends', capacity: 'range', levels: 0, extras: [],
            flaws: [
                { id: 'tt_fwd_q2_fl1', definitionId: 'if_then', name: 'If/Then (Cannot travel somewhere you already exist)', costModifier: -1, isCustom: false },
            ]
        },
        {
            id: 'tt_fwd_q3_use', type: 'useful', capacity: 'range', levels: 0, extras: [],
            flaws: [
                { id: 'tt_fwd_q3_fl1', definitionId: 'if_then', name: 'If/Then (Cannot travel somewhere you already exist)', costModifier: -1, isCustom: false },
            ]
        }, // BACKWARDS
        {
            id: 'tt_bwd_q1_atk', type: 'attacks', capacity: 'range', levels: 0, extras: [],
            flaws: [
                { id: 'tt_bwd_q1_fl1', definitionId: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, isCustom: false }, // Standard cost
                { id: 'tt_bwd_q1_fl2', definitionId: 'if_then', name: 'If/Then (Cannot travel somewhere you already exist)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'tt_bwd_q2_def', type: 'defends', capacity: 'range', levels: 0, extras: [],
            flaws: [
                { id: 'tt_bwd_q2_fl1', definitionId: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, isCustom: false },
                { id: 'tt_bwd_q2_fl2', definitionId: 'if_then', name: 'If/Then (Cannot travel somewhere you already exist)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'tt_bwd_q3_use', type: 'useful', capacity: 'range', levels: 0, extras: [],
            flaws: [
                { id: 'tt_bwd_q3_fl1', definitionId: 'base_will_cost', name: 'Base Will Cost', costModifier: -4, isCustom: false },
                { id: 'tt_bwd_q3_fl2', definitionId: 'if_then', name: 'If/Then (Cannot travel somewhere you already exist)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'transform_type',
    name: 'Transform (Type)',
    description: "This power comes in two versions; choose one. With the first version, your power transforms some particular substance or type of energy into any other substance or type of energy—you could transform lead to anything you want with Transform Lead, or transform light into anything you want with Transform Light, or transform a human into anything with Transform Human, and so on.\nWith the second version, your power transforms any substance or energy into some specific thing—you could transform anything to lead with Transform to Lead, or anything to light with Transform to Light, or anything to one or more humans with Transform to Human, and so on.\nIf your power has the mass capacity, it transforms into a solid substance but you must touch the target. If it transforms non-solid energy, it can transform at range.\nThe transformation lasts for the duration of the current encounter or for a few minutes, according to the Duration Extra. Replace Duration with Endless or Permanent to extend the effects.\nTo restrict your power—transform lead to gold but to nothing else, for example—take the If/Then Flaw. To broaden it—transform anything to anything—take the Variable Effect Extra.",
    qualities: [
        {
            id: 'trans_q1_use', type: 'useful', capacity: 'mass', levels: 0, // or range
            extras: [
                { id: 'trans_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false }
            ],
            flaws: []
        }
    ]
  },
  {
    definitionId: 'unconventional_movement',
    name: 'Unconventional Movement',
    description: "You can move in an unusual way: climb walls, ride a wave of ice, walk on water, whatever you wish. If the movement also allows you to get out of the way of attacks, such as by jumping onto walls or tunneling instantly away, add the Defends quality. If the power allows you to attack in a special way, such as swinging into an opponent or by undermining an enemy’s footing, add Attacks.\nIf you wish to have multiple unusual ways of moving. Add variable effect.",
    qualities: [
      { id: 'um_q1_use', type: 'useful', capacity: 'speed', levels: 0, extras: [], flaws: [] }
    ]
  },
  {
    definitionId: 'utility_belt',
    name: 'Utility Belt',
    description: "You possess a tool belt with many small compartments which you have filled with useful gadgets. Somehow, you always have just the right tool for the job. You can pull out such an item by assigning dice from your Utility Belt power, but you only carry a total number of items equal to the number of dice in the Utility Belt power squared. Thus, if you have Utility Belt 2d+2HD+1WD, your Belt contains 25 gadgets.\nYou define the effect of each gadget as you draw it using the normal rules for Variable Effect, although each device must have the Focus flaw, and many will have the One Use flaw, representing disposable tools. Of course, you can always pull out a new smoke bomb, taser dart, or whatever by activating Utility Belt again.\nOnce you have depleted your Belt’s stored items, you must restock at your base. This requires extensive work fashioning new gadgets and should be handled during downtime.",
    qualities: [
        {
            id: 'ub_q1_atk', type: 'attacks', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'ub_q1_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'ub_q1_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ub_q1_fl1', definitionId: 'depleted', name: 'Depleted', costModifier: -1, isCustom: false },
                { id: 'ub_q1_fl2', definitionId: 'focus', name: 'Focus', costModifier: -1, isCustom: false },
                { id: 'ub_q1_fl3', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'ub_q1_fl4', definitionId: 'if_then', name: 'If/Then (Only for small equipment)', costModifier: -1, isCustom: false },
                { id: 'ub_q1_fl5', definitionId: 'if_then', name: 'If/Then (Qualities share recharges)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'ub_q2_def', type: 'defends', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'ub_q2_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'ub_q2_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ub_q2_fl1', definitionId: 'depleted', name: 'Depleted', costModifier: -1, isCustom: false },
                { id: 'ub_q2_fl2', definitionId: 'focus', name: 'Focus', costModifier: -1, isCustom: false },
                { id: 'ub_q2_fl3', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'ub_q2_fl4', definitionId: 'if_then', name: 'If/Then (Only for small equipment)', costModifier: -1, isCustom: false },
                { id: 'ub_q2_fl5', definitionId: 'if_then', name: 'If/Then (Qualities share recharges)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'ub_q3_use', type: 'useful', capacity: 'n_a', levels: 0,
            extras: [
                { id: 'ub_q3_ex1', definitionId: 'duration', name: 'Duration', costModifier: 2, isCustom: false },
                { id: 'ub_q3_ex2', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ub_q3_fl1', definitionId: 'depleted', name: 'Depleted', costModifier: -1, isCustom: false },
                { id: 'ub_q3_fl2', definitionId: 'focus', name: 'Focus', costModifier: -1, isCustom: false },
                { id: 'ub_q3_fl3', definitionId: 'if_then', name: 'If/Then (Only for Variable Effect)', costModifier: -1, isCustom: false },
                { id: 'ub_q3_fl4', definitionId: 'if_then', name: 'If/Then (Only for small equipment)', costModifier: -1, isCustom: false },
                { id: 'ub_q3_fl5', definitionId: 'if_then', name: 'If/Then (Qualities share recharges)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'vicious',
    name: 'Vicious',
    description: "This power makes any attack more dangerous than usual. Add Vicious’ damage bonus from its Attacks Power Quality Levels to any attack action, whether it’s another power or some weapon attack. In fact, even if the attack ordinarily would do no damage—using Athletics to beat somebody with a wiffle ball, for example—you can add the Vicious bonus to it if you score a hit. However, you must roll the smaller of the two dice pools, Vicious or whatever attack it modifies. To apply this to a specific Stat, Skill or power, use the Attached Flaw or simply increase its native Attacks quality.",
    qualities: [
        {
            id: 'vic_q1_atk', type: 'attacks', capacity: 'n_a', levels: 1, // Attacks +1
            extras: [
                { id: 'vic_q1_ex1', definitionId: 'augment', name: 'Augment', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'vic_q1_fl1', definitionId: 'if_then', name: 'If/Then (must announce in the declare phase)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'weather_control',
    name: 'Weather Control',
    description: "The attacks quality enables the user to electrocute people with bolts of lightning, or buffet them with wind and other variable effects of the weather, dazing them and slowing them down with the cold.\nThe defends quality is a generic catch all for using the weather to defend one's self or others.\nThe useful quality is the same as the flight power, but has variable effect to allow all sorts of out of combat maneuvers with it.",
    qualities: [
        {
            id: 'wc_q1_atk', type: 'attacks', capacity: 'mass', levels: 0, // base mass, range is extra
            extras: [
                { id: 'wc_q1_ex1', definitionId: 'daze', name: 'Daze', costModifier: 1, isCustom: false },
                { id: 'wc_q1_ex2', definitionId: 'electrocuting', name: 'Electrocuting', costModifier: 1, isCustom: false },
                { id: 'wc_q1_ex3', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Range)', costModifier: 2, isCustom: false }, // adding range
                { id: 'wc_q1_ex4', definitionId: 'spray', name: 'Spray', costModifier: 1, isCustom: false },
                { id: 'wc_q1_ex5', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'wc_q1_fl1', definitionId: 'fragile', name: 'Fragile', costModifier: -1, isCustom: false },
                { id: 'wc_q1_fl2', definitionId: 'if_then', name: 'If/Then (Only for Weather Effects)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'wc_q2_def', type: 'defends', capacity: 'range', levels: 0,
            extras: [
                { id: 'wc_q2_ex1', definitionId: 'spray', name: 'Spray', costModifier: 1, isCustom: false }
            ],
            flaws: [
                { id: 'wc_q2_fl1', definitionId: 'fragile', name: 'Fragile', costModifier: -1, isCustom: false },
                { id: 'wc_q2_fl2', definitionId: 'if_then', name: 'If/Then (Only for Weather Effects)', costModifier: -1, isCustom: false }
            ]
        },
        {
            id: 'wc_q3_use', type: 'useful', capacity: 'mass', levels: 0, // base mass, speed is extra
            extras: [
                { id: 'wc_q3_ex1', definitionId: 'power_capacity_mrs', name: 'Power Capacity (Speed)', costModifier: 2, isCustom: false }, // adding speed
                { id: 'wc_q3_ex2', definitionId: 'spray', name: 'Spray', costModifier: 1, isCustom: false },
                { id: 'wc_q3_ex3', definitionId: 'variable_effect', name: 'Variable Effect', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'wc_q3_fl1', definitionId: 'fragile', name: 'Fragile', costModifier: -1, isCustom: false },
                { id: 'wc_q3_fl2', definitionId: 'if_then', name: 'If/Then (Only for Weather Effects)', costModifier: -1, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'willpower_battery',
    name: 'Willpower Battery',
    description: "You can set aside a number of Willpower points in a battery—whether it’s a physical battery of psychic power or a metaphor for some inner reserves—that are separate from your ordinary Willpower score. You can use this Willpower for any normal purpose, but you cannot lose Willpower from it unless you choose to lose them. With a successful roll you can place width in Willpower in the battery, which can hold a maximum of one Willpower per die. The Willpower points remain in the battery until you use them. If you remove the Endless Extra, the Willpower points return to you automatically at the end of the power’s duration.\nIf your Willpower Battery power is in a focus that can be used by other characters (page 134), others can invest Willpower in it and use its stored Willpower.",
    qualities: [
        {
            id: 'wb_q1_use', type: 'useful', capacity: 'self', levels: 0,
            extras: [
                { id: 'wb_q1_ex1', definitionId: 'endless', name: 'Endless', costModifier: 3, isCustom: false }
            ],
            flaws: [
                { id: 'wb_q1_fl1', definitionId: 'self_only', name: 'Self Only', costModifier: -3, isCustom: false }
            ]
        }
    ]
  },
  {
    definitionId: 'yo_adrian',
    name: 'Yo Adrian',
    description: "Light Armour 1 to all attacks, including those with penetration.",
    qualities: [
        {
            id: 'ya_q1_def', type: 'defends', capacity: 'self', levels: 0,
            extras: [
                { id: 'ya_q1_ex1', definitionId: 'hardened_defense', name: 'Hardened Defence', costModifier: 2, isCustom: false },
                { id: 'ya_q1_ex2', definitionId: 'permanent', name: 'Permanent', costModifier: 4, isCustom: false }
            ],
            flaws: [
                { id: 'ya_q1_fl1', definitionId: 'armored_defense', name: 'Armored defence', costModifier: -2, isCustom: false },
                { id: 'ya_q1_fl2', definitionId: 'limited_width', name: 'Limited Width', costModifier: -1, isCustom: false }
            ]
        }
    ]
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

    

