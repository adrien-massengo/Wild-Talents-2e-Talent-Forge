
// src/lib/cost-calculations.ts
import type { StatDetail, SkillInstance, BasicInfo as PageBasicInfo, CharacterData as PageCharacterData } from '@/app/page';
import type { DiscardedAttributeType } from '@/lib/character-definitions';
import { getDynamicPowerQualityDefinitions, type MiracleQuality as MiracleQualityDef, type MiracleDefinition } from '@/lib/miracles-definitions';
import { calculateMetaQualitiesPointCost as calculateRawMetaQualitiesPointCost, ARCHETYPES, INTRINSIC_META_QUALITIES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES } from '@/lib/character-definitions';

// Re-export types from character-definitions if they are specific to costs or MQs
export { calculateRawMetaQualitiesPointCost, ARCHETYPES, INTRINSIC_META_QUALITIES, SOURCE_META_QUALITIES, PERMISSION_META_QUALITIES };


// Calculate Cost of a Single Stat
export const calculateSingleStatPoints = (stat: StatDetail | undefined, statName?: keyof PageCharacterData['stats'], discardedAttribute?: DiscardedAttributeType): number => {
  if (!stat || (discardedAttribute && statName === discardedAttribute)) return 0;
  const normalDice = parseInt(stat.dice?.replace('D', ''), 10) || 0;
  const hardDice = parseInt(stat.hardDice?.replace('HD', ''), 10) || 0;
  const wiggleDice = parseInt(stat.wiggleDice?.replace('WD', ''), 10) || 0;
  return (normalDice * 5) + (hardDice * 10) + (wiggleDice * 20);
};

// Calculate Total Stat Cost
export const calculateTotalStatPoints = (stats: PageCharacterData['stats'], discardedAttribute?: DiscardedAttributeType): number => {
  return Object.entries(stats || {}).reduce((sum, [key, stat]) => {
    return sum + calculateSingleStatPoints(stat, key as keyof PageCharacterData['stats'], discardedAttribute);
  }, 0);
};

// Calculate Willpower Points
export const calculateTotalWillpowerPoints = (
    purchasedBaseWill: number,
    purchasedWill: number,
    hasNoBaseWill: boolean,
    hasNoWillpower: boolean
  ): number => {
    const effectivePurchasedBaseWill = hasNoBaseWill ? 0 : purchasedBaseWill;
    const effectivePurchasedWill = (hasNoBaseWill || hasNoWillpower) ? 0 : purchasedWill;
    
    const purchasedBaseWillPoints = (effectivePurchasedBaseWill || 0) * 3;
    const purchasedWillPoints = (effectivePurchasedWill || 0) * 1;
    return purchasedBaseWillPoints + purchasedWillPoints;
  };

// Calculate Cost of a Single Skill
export const calculateSingleSkillPoints = (skill: SkillInstance | undefined): number => {
  if (!skill) return 0;
  const normalDice = parseInt(skill.dice?.replace('D', ''), 10) || 0;
  const hardDice = parseInt(skill.hardDice?.replace('HD', ''), 10) || 0;
  const wiggleDice = parseInt(skill.wiggleDice?.replace('WD', ''), 10) || 0;
  return (normalDice * 2) + (hardDice * 4) + (wiggleDice * 8);
};

// Calculate Total Skill Cost
export const calculateTotalSkillPoints = (skills: SkillInstance[]): number => {
  return (skills || []).reduce((sum, skill) => sum + calculateSingleSkillPoints(skill), 0);
};

// Calculate Miracle Quality Cost (dependent on miracle's dice)
export const calculateSingleMiracleQualityCost = (quality: MiracleQualityDef, miracle: MiracleDefinition, allSkills: SkillInstance[] | undefined): number => {
  const NDice = (miracle && miracle.dice) ? parseInt(miracle.dice.replace('D', '')) || 0 : 0;
  const HDice = (miracle && miracle.hardDice) ? parseInt(miracle.hardDice.replace('HD', '')) || 0 : 0;
  const WDice = (miracle && miracle.wiggleDice) ? parseInt(miracle.wiggleDice.replace('WD', '')) || 0 : 0;
  const powerQualitySkills = allSkills || [];
  const allPowerQualityDefinitions = getDynamicPowerQualityDefinitions(powerQualitySkills);
  const qualityDef = allPowerQualityDefinitions.find(def => def.key === quality.type);
  if (!qualityDef) return 0;
  
  const baseCostFactor = qualityDef.baseCostFactor;
  let totalExtrasCostModifier = quality.extras.reduce((sum, ex) => sum + ex.costModifier, 0);
  let totalFlawsCostModifier = quality.flaws.reduce((sum, fl) => sum + fl.costModifier, 0);

  const effectiveCostModifier = quality.levels + totalExtrasCostModifier + totalFlawsCostModifier;
  
  const perNormalDieCostFactor = baseCostFactor + effectiveCostModifier;
  const actualQualityNormalDieCostFactor = Math.max(1, perNormalDieCostFactor);

  const costND = NDice > 0 ? NDice * actualQualityNormalDieCostFactor : 0;
  const costHD = HDice > 0 ? HDice * actualQualityNormalDieCostFactor * 2 : 0;
  const costWD = WDice > 0 ? WDice * actualQualityNormalDieCostFactor * 4 : 0;

  return costND + costHD + costWD;
};

// Calculate Total Cost of a Single Miracle
export const calculateSingleMiracleTotalCost = (miracle: MiracleDefinition, allSkills: SkillInstance[]): number => {
  if (miracle.isMandatory) return 0;
  return miracle.qualities.reduce((sum, quality) => sum + calculateSingleMiracleQualityCost(quality, miracle, allSkills), 0);
};

// Calculate Total Miracle Cost for all miracles
export const calculateTotalMiraclePoints = (miracles: MiracleDefinition[], allSkills: SkillInstance[]): number => {
  return (miracles || []).reduce((sum, miracle) => {
    return sum + calculateSingleMiracleTotalCost(miracle, allSkills);
  }, 0);
};

// Calculate Archetype/Meta-Qualities Cost
export const calculateCurrentArchetypeCost = (basicInfo: PageBasicInfo): number => {
  const selectedArchetypeDef = ARCHETYPES.find(arch => arch.id === basicInfo.selectedArchetypeId);
  return selectedArchetypeDef && selectedArchetypeDef.id !== 'custom' 
    ? selectedArchetypeDef.points 
    : calculateRawMetaQualitiesPointCost(basicInfo);
};

