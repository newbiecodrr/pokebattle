// Pokemon OOP class - C++ ke class jaisa structure banaya hai
// React state ke bahar rakha hai taaki battle calculation pure rahe aur lag na kare
export default class Pokemon {
  constructor(
    name = "Unknown",
    maxHp = 100,
    maxEnergy = 50,
    baseDamage = 20,
    defense = 10,
    strongCost = 15,
    types = ["Normal"],
    moves = { weak: "Quick Strike", strong: "Special Attack" }
  ) {
    // C++ constructor initializer list jaisa instance variables set kar rahe hain
    this.name = name;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;
    this.baseDamage = baseDamage;
    this.defense = defense;
    this.strongCost = strongCost;
    this.types = Array.isArray(types) ? types : [types];
    this.moves = {
      weak: moves.weak || "Quick Strike",
      strong: moves.strong || "Special Attack",
    };
    this.isDefending = false;
    this.sprite = "";
    this.id = name.toLowerCase();
  }

  // 1. Weak Attack: 0 energy lagti hai, ulta thoda stamina (+5) recover hota hai
  weakAttack(target) {
    if (!target) return null; // Null pointer check jaise C++ me karte hain

    // Thoda sa energy refund kar rahe hain taaki player bilkul helpless na ho jaye
    this.energy = Math.min(this.maxEnergy, this.energy + 5);

    // Random variance: 90% se 110% ke beech damage float karega (jaise rand() % range)
    const variance = 0.9 + Math.random() * 0.2;
    // 15% probability hai critical hit lagne ki
    const isCrit = Math.random() < 0.15;
    const critBonus = isCrit ? 1.5 : 1.0;

    const rawDamage = Math.round(this.baseDamage * variance * critBonus);
    const damageDealt = target.takeDamage(rawDamage);

    // Attack karne ke baad shield posture automatically reset ho jata hai
    this.isDefending = false;

    const moveName = this.moves.weak;
    const message = isCrit
      ? `💥 CRITICAL HIT! ${this.name} used ${moveName} for ${damageDealt} DMG!`
      : `⚔️ ${this.name} used ${moveName} and dealt ${damageDealt} DMG.`;

    return {
      success: true,
      attacker: this.name,
      target: target.name,
      moveName,
      damage: damageDealt,
      isCrit,
      message,
      action: "weak",
    };
  }

  // 2. Strong Attack: Heavy special move, but energy chahiye hoti hai
  strongAttack(target) {
    if (!target) return null;

    // Check karo energy hai ya nahi, nahi toh move cancel karo
    if (this.energy < this.strongCost) {
      return {
        success: false,
        reason: `Need ${this.strongCost} EN, but only have ${this.energy} EN.`,
        damage: 0,
        action: "strong",
      };
    }

    // Energy deduct karo
    this.energy -= this.strongCost;

    // Strong attack me 25% crit chance rakhi hai aur 2.25x base multiplier
    const variance = 0.95 + Math.random() * 0.25;
    const isCrit = Math.random() < 0.25;
    const critBonus = isCrit ? 1.6 : 1.0;

    const rawDamage = Math.round(this.baseDamage * 2.25 * variance * critBonus);
    const damageDealt = target.takeDamage(rawDamage);

    this.isDefending = false;

    const moveName = this.moves.strong;
    const message = isCrit
      ? `⚡ CRITICAL BLAST! ${this.name} unleashed ${moveName} for ${damageDealt} DMG!`
      : `🔥 ${this.name} unleashed ${moveName} for ${damageDealt} DMG!`;

    return {
      success: true,
      attacker: this.name,
      target: target.name,
      moveName,
      damage: damageDealt,
      isCrit,
      message,
      action: "strong",
    };
  }

  // 3. Defend: Agle turn aane wale damage ko aadha (50%) kar dega aur +12 stamina dega
  defend() {
    this.isDefending = true;
    const recovered = 12;
    this.energy = Math.min(this.maxEnergy, this.energy + recovered);

    return {
      success: true,
      attacker: this.name,
      energyGained: recovered,
      message: `🛡️ ${this.name} is guarding! (+${recovered} EN & 50% damage reduction next turn).`,
      action: "defend",
    };
  }

  // 4. Charge: Meditation karke sidha +25 energy recharge
  chargeEnergy() {
    const gained = Math.min(this.maxEnergy - this.energy, 25);
    this.energy += gained;
    this.isDefending = false;

    return {
      success: true,
      attacker: this.name,
      energyGained: gained,
      message: `⚡ ${this.name} charged up +${gained} EN (${this.energy}/${this.maxEnergy} EN).`,
      action: "charge",
    };
  }

  // Damage calculation logic - target ki defense aur guarding state ko subtract karte hain
  takeDamage(rawDamage) {
    let effectiveDamage = rawDamage;

    if (this.isDefending) {
      // Agar guard on tha, to direct 50% cut + extra defense bonus
      effectiveDamage = Math.max(3, Math.round(rawDamage * 0.5 - this.defense * 0.8));
      this.isDefending = false; // Hit lagte hi shield toot gayi
    } else {
      effectiveDamage = Math.max(5, Math.round(rawDamage - this.defense * 0.4));
    }

    // Health ko 0 se neeche mat jaane do (clamp at 0)
    this.currentHp = Math.max(0, this.currentHp - effectiveDamage);
    return effectiveDamage;
  }

  isFainted() {
    return this.currentHp <= 0;
  }

  // CPU ka decision tree (Basic AI heuristic, if-else logic)
  getComputerMove(opponent) {
    const hasEnoughEnergy = this.energy >= this.strongCost;
    const myHpPercent = this.currentHp / this.maxHp;

    // 1. Agar player ka HP itna kam hai ki strong attack se mar sakta hai toh bina soche uda do
    if (hasEnoughEnergy && opponent && opponent.currentHp <= this.baseDamage * 2.2) {
      return "strong";
    }

    // 2. Agar weak attack se hi kaam chal jayega toh faltu energy waste mat karo
    if (opponent && opponent.currentHp <= this.baseDamage * 0.8) {
      return "weak";
    }

    // 3. Agar CPU ka khud ka HP 25% se kam hai aur opponent ke paas energy hai toh guard karo ya charge karo
    if (myHpPercent < 0.25 && opponent && opponent.energy >= opponent.strongCost && !this.isDefending) {
      return Math.random() < 0.5 ? "defend" : "charge";
    }

    // 4. Agar energy khatam ho gayi toh pehle charge karo
    if (this.energy < this.strongCost) {
      return Math.random() < 0.65 ? "charge" : "weak";
    }

    // 5. Normal mode me 60% heavy attack maro, 25% weak poke, 15% guard
    const roll = Math.random();
    if (roll < 0.6) return "strong";
    if (roll < 0.85) return "weak";
    return "defend";
  }

  // Rematch ke liye stats reset kar do
  reset() {
    this.currentHp = this.maxHp;
    this.energy = this.maxEnergy;
    this.isDefending = false;
  }

  // C++ ke copy constructor jaisa deep clone banata hai taaki original object pollute na ho
  clone() {
    const copy = new Pokemon(
      this.name,
      this.maxHp,
      this.maxEnergy,
      this.baseDamage,
      this.defense,
      this.strongCost,
      [...this.types],
      { ...this.moves }
    );
    copy.sprite = this.sprite;
    copy.backSprite = this.backSprite;
    copy.id = this.id;
    copy.accentColor = this.accentColor;
    copy.description = this.description;
    copy.pokedexId = this.pokedexId;
    return copy;
  }
}