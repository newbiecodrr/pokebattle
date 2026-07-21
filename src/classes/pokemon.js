export default class Pokemon {
  constructor(name, maxHp, maxEnergy, sAttack, wAttack, defense) {
    this.name = name;
    this.maxHp = maxHp;
    this.hp = maxHp; // Starts at max
    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy; // Starts at max
    this.sAttack = sAttack;
    this.wAttack = wAttack;
    this.defense = defense;
    this.defending = false;
  }

  isAlive() {
    return this.hp > 0;
  }

  takeDamage(damage) {
    if (this.defending) {
      damage = Math.floor(damage / 2);
      this.defending = false; // Reset defense status after taking a hit
    }

    this.hp = Math.max(0, this.hp - damage);
    return damage;
  }

  attack(target, type) {
    this.defending = false; // Attacking drops your guard

    if (type === "s") {
      const dmgDealt = target.takeDamage(this.sAttack);
      return `${this.name} uses strong attack on ${target.name} dealing ${dmgDealt} damage.`;
    } else if (type === "w") {
      const dmgDealt = target.takeDamage(this.wAttack);
      return `${this.name} uses weak attack on ${target.name} dealing ${dmgDealt} damage.`;
    }
  }

  defend() {
    this.defending = true;
    // Ported your C++ formula: (Sattack - Wattack) / 2 + rand() % 10 + 1
    const healAmount =
      Math.floor((this.sAttack - this.wAttack) / 2) +
      Math.floor(Math.random() * 10) +
      1;
    this.hp = Math.min(this.maxHp, this.hp + healAmount);

    return `${this.name} is now defending and recovered ${healAmount} HP.`;
  }

  charge() {
    this.defending = false;
    // Ported your C++ formula: max(energy + 20 + rand() % 11, maxEnergy)
    const energyBoost = 20 + Math.floor(Math.random() * 11);
    this.energy = Math.min(this.maxEnergy, this.energy + energyBoost);

    return `${this.name} charged its energy! Current Energy: ${this.energy}/${this.maxEnergy}.`;
  }
}
