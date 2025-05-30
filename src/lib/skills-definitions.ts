
// src/lib/skills-definitions.ts

export type AttributeName = 'body' | 'coordination' | 'sense' | 'mind' | 'charm' | 'command';

export interface SkillDefinition {
  id: string; // Unique key for the definition
  name: string; // Base name of the skill, e.g., "Athletics", "Melee Weapon"
  linkedAttribute: AttributeName;
  description: string;
  hasType?: boolean; // True for skills like "Melee Weapon (Type)"
  typePrompt?: string; // Placeholder for the type input, e.g., "Specify Weapon"
  sampleTypes?: string; // e.g., "Club, Knife, Bayonet, Sword, Axe."
  notes?: string; // e.g., "(May use a related type at –1d with GM approval.)"
}

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // Body Skills
  { id: 'athletics', name: 'Athletics', linkedAttribute: 'body', description: 'You excel at athletic feats like climbing, jumping, swimming, running, and throwing.' },
  { id: 'block', name: 'Block', linkedAttribute: 'body', description: 'You know how to defend yourself against hand-to-hand attacks.' },
  { id: 'brawling', name: 'Brawling', linkedAttribute: 'body', description: 'You are a bruiser and know how to attack with your hands, feet, and head.' },
  { id: 'endurance', name: 'Endurance', linkedAttribute: 'body', description: 'You can pace yourself, hold your breath, run, or resist environmental and exertion-based stress longer than most people.' },
  { id: 'melee_weapon', name: 'Melee Weapon', linkedAttribute: 'body', description: 'You are skilled with a specific hand-to-hand weapon.', hasType: true, typePrompt: 'Weapon Type', sampleTypes: 'Club, Knife, Bayonet, Sword, Axe.', notes: '(May use a related type at –1d with GM approval.)' },

  // Coordination Skills
  { id: 'dodge', name: 'Dodge', linkedAttribute: 'coordination', description: 'You’re adept at dodging attacks, ducking projectiles, and keeping balance.' },
  { id: 'driving', name: 'Driving', linkedAttribute: 'coordination', description: 'You can drive or pilot a specific type of vehicle.', hasType: true, typePrompt: 'Vehicle Type', sampleTypes: 'Car, Motorcycle, Sailboat, Tank, Jet Aircraft, Helicopter.', notes: '(May use a related type at –1d with GM approval.)' },
  { id: 'ranged_weapon', name: 'Ranged Weapon', linkedAttribute: 'coordination', description: 'You’re skilled with a specific ranged weapon.', hasType: true, typePrompt: 'Weapon Type', sampleTypes: 'Crossbow, Pistol, Rifle, Machine Gun, Rocket Launcher, Hand Grenade, Submachine Gun, Tank Gun.', notes: '(May use a related type at –1d with GM approval.)' },
  { id: 'stealth', name: 'Stealth', linkedAttribute: 'coordination', description: 'You’re skilled in moving quietly, remaining unseen, and picking pockets. Opposed by the target’s Perception.' },

  // Sense Skills
  { id: 'empathy', name: 'Empathy', linkedAttribute: 'sense', description: 'You can intuitively read the emotional states of others.' },
  { id: 'perception', name: 'Perception', linkedAttribute: 'sense', description: 'You notice subtle details and events others miss.' },
  { id: 'scrutiny', name: 'Scrutiny', linkedAttribute: 'sense', description: 'You excel at searching for hidden things or obscure details.' },

  // Mind Skills
  { id: 'first_aid', name: 'First Aid', linkedAttribute: 'mind', description: 'You can treat wounds and stabilize patients with proper equipment.' },
  { id: 'knowledge', name: 'Knowledge', linkedAttribute: 'mind', description: 'You have expertise in a specific field.', hasType: true, typePrompt: 'Field of Knowledge', sampleTypes: 'Computer Systems, Criminology, Cryptology, Demolitions, Electronics, Engineering, Forgery, Mechanics, Surgery, Archaeology, Bavarian Court Etiquette.' },
  { id: 'language', name: 'Language', linkedAttribute: 'mind', description: 'You can speak, read, and write a specific language.', hasType: true, typePrompt: 'Language Name', sampleTypes: 'Alien Language [specify], Arabic, Dutch, English, French, German, Spanish.', notes: '(Use lower of this and target Skill dice pool when language is required.)' },
  { id: 'medicine', name: 'Medicine', linkedAttribute: 'mind', description: 'You can treat illness and injuries long-term. Cannot exceed your First Aid Skill.' },
  { id: 'navigation', name: 'Navigation', linkedAttribute: 'mind', description: 'You can navigate via map, stars, instruments, or dead reckoning.' },
  { id: 'research', name: 'Research', linkedAttribute: 'mind', description: 'You excel at finding rare, obscure, or hidden information.' },
  { id: 'security_systems', name: 'Security Systems', linkedAttribute: 'mind', description: 'You know how to bypass, disable, and reconfigure electronic security.' },
  { id: 'streetwise', name: 'Streetwise', linkedAttribute: 'mind', description: 'You know how to operate within criminal or informal social systems.' },
  { id: 'survival', name: 'Survival', linkedAttribute: 'mind', description: 'You’re familiar with surviving in harsh environments.' },
  { id: 'tactics', name: 'Tactics', linkedAttribute: 'mind', description: 'You understand strategic coordination, positioning, and battlefield planning.' },

  // Charm Skills
  { id: 'lie', name: 'Lie', linkedAttribute: 'charm', description: 'You can convincingly fabricate and bluff your way through social situations.' },
  { id: 'performance', name: 'Performance', linkedAttribute: 'charm', description: 'You can entertain or impress an audience using a specific performance art.', hasType: true, typePrompt: 'Performance Type', sampleTypes: 'Acting, Flute, Guitar, Public Speaking, Singing.', notes: '(May use a related type at –1d with GM approval.)' },
  { id: 'persuasion', name: 'Persuasion', linkedAttribute: 'charm', description: 'You can influence opinions and change people’s minds.' },

  // Command Skills
  { id: 'interrogation', name: 'Interrogation', linkedAttribute: 'command', description: 'You know how to get truthful answers through manipulation or coercion.' },
  { id: 'intimidation', name: 'Intimidation', linkedAttribute: 'command', description: 'You can use fear—psychological or physical—to influence others.' },
  { id: 'leadership', name: 'Leadership', linkedAttribute: 'command', description: 'You can inspire and direct others under pressure.' },
  { id: 'stability', name: 'Stability', linkedAttribute: 'command', description: 'You resist psychological shock, torture, and coercion, and maintain composure under stress.' },
];
