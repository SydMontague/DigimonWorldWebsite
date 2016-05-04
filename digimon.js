function Digimon (name, statsGains, requirements) {
  this.name = name;
  this.statsGains = statsGains;
  this.requirements = requirements;
  this.calculateStatsGain = function(stats, value) {
    var localValue;
    switch(stats) {
      case "hp": localValue = statsGains.hp; break;
      case "mp": localValue = statsGains.mp; break;
      case "offense": localValue = statsGains.offense; break;
      case "defense": localValue = statsGains.defense; break;
      case "speed": localValue = statsGains.speed; break;
      case "brains": localValue = statsGains.brains; break;
    }
    
    if(value >= localValue) {
      return Math.floor(localValue * 0.1);
    }
    else {
      return Math.floor((localValue - value) / 2);
    }
  };
  
  this.fulfillsRequirements = function(digimon, hp, mp, offense, defense, speed, brains, care, weight, happiness, discipline, battles, techs) {
    var counter = 0;
    
    if(requirements.fulfillStats(hp, mp, offense, defense, speed, brains))
      counter++;
    if(requirements.fulfillCare(care))
      counter++;
    if(requirements.fulfillWeight(weight))
      counter++;
    if(requirements.fulfillBonus(happiness, discipline, battles, techs, digimon))
      counter++;
      
    return counter >= 3;
  };
  
  this.getPriorityStats = function() {      
    var string = "";
    if(requirements.hp != 0) {
      string += "HP ";
    }
    if(requirements.mp != 0) {
      string += "MP ";
    }
    if(requirements.offense != 0) {
      string += "Offense ";
    }
    if(requirements.defense != 0) {
      string += "Defense ";
    }
    if(requirements.speed != 0) {
      string += "Speed ";
    }
    if(requirements.brains != 0) {
      string += "Brains ";
    }
    
    return string == "" ? "none" : string;
  }
}

function EvolutionRequirements (hp, mp, offense, defense, speed, brains, care, weight, discipline, happiness, battles, techs, minCare, minBattles, digimonBonus) {
  this.hp = hp;
  this.mp = mp;
  this.offense = offense;
  this.defense = defense;
  this.speed = speed;
  this.brains = brains;
  this.care = care;
  this.weight = weight;
  this.happiness = happiness;
  this.discipline = discipline;
  this.techs = techs;
  this.battles = battles;
  this.minBattles = minBattles;
  this.minCare = minCare;
  this.digimonBonus = digimonBonus;
  
  this.fulfillStats = function(hp, mp, offense, defense, speed, brains) {
    if(this.hp != 0 && hp < this.hp)
      return false;
    if(this.mp != 0 && mp < this.mp)
      return false;
    if(this.offense != 0 && offense < this.offense)
      return false;
    if(this.defense != 0 && defense < this.defense)
      return false;
    if(this.speed != 0 && speed < this.speed)
      return false;
    if(this.brains != 0 && brains < this.brains)
      return false;
    
    return true;
  };
  
  this.fulfillCare = function(care) {
    return this.minCare ? care <= this.care : care >= this.care;
  };
  
  this.fulfillWeight = function(weight) {
    return (this.weight - 5) <= weight && (this.weight + 5) >= weight;
  };
  
  this.fulfillBonus = function(happiness, discipline, battles, techs, digimon) {
    if(this.digimonBonus != "" && digimon == this.digimonBonus)
      return true;
      
    if(this.techs != 0 && techs >= this.techs)
      return true;
      
    if(this.discipline != 0 && discipline >= this.discipline)
      return true;
      
    if(this.happiness != 0 && happiness >= this.happiness)
      return true;
      
    if(this.battles >= 0)
      if(this.minBattles && this.battles >= battles)
        return true;
      else if(!this.minBattles && this.battles <= battles)
        return true;
        
    return false;
  };
  
  this.calculatePriorityValue = function(hp, mp, offense, defense, speed, brains) {
    var statsSum = 0;
    var statsCounter = 0;
    
    if(this.hp != 0 && !isNaN(hp)) {
      statsSum += parseInt(hp) / 10;
      statsCounter++;      
    }
    if(this.mp != 0 && !isNaN(mp)) {
      statsSum += parseInt(mp) / 10;
      statsCounter++;
    }
    if(this.offense != 0 && !isNaN(offense)) {
      statsSum += parseInt(offense);
      statsCounter++;
    }
    if(this.defense != 0 && !isNaN(defense)) {
      statsSum += parseInt(defense);
      statsCounter++;
    }
    if(this.speed != 0 && !isNaN(speed)) {
      statsSum += parseInt(speed);
      statsCounter++;
    }
    if(this.brains != 0 && !isNaN(brains)) {
      statsSum += parseInt(brains);
      statsCounter++;
    }
    
    var score = Math.floor(statsSum / statsCounter);
    return isNaN(score) ? 0 : score;
  };
}

function StatsGains (hp, mp, offense, defense, speed, brains) {
  this.hp = hp;
  this.mp = mp;
  this.offense = offense;
  this.defense = defense;
  this.speed = speed;
  this.brains = brains;
}

function EvolutionPath(targets) {
  this.targets = targets;
  
  this.canEvolveTo = function(digimon) {
    for(var v in targets) {    
      if(targets[v] == digimon) {
        return true;
      }
    }
    
    return false;
  };
  
  this.getPaths = function(digimon) {
    if(this.canEvolveTo(digimon)) {
      return [ digimon ];
    }
    
    var paths = {};
    var i = 0;
    
    for(var v in targets) {
      var paths2 = getEvolutionPath(targets[v]).getPaths(digimon);
      
      for(var k in paths2) {
        paths[i++] = targets[v] + " -> " + paths2[k];
      }
    }
    
    return paths;
  };
}

/* Define all Evolution paths in order of priority. */
var EvolutionPaths = {};
EvolutionPaths["Botamon"] = new EvolutionPath(["Koromon", "Sukamon"]);
EvolutionPaths["Poyomon"] = new EvolutionPath(["Tokomon", "Sukamon"]);
EvolutionPaths["Punimon"] = new EvolutionPath(["Tsunomon", "Sukamon"]);
EvolutionPaths["Yuramon"] = new EvolutionPath(["Tanemon", "Sukamon"]);
EvolutionPaths["Koromon"] = new EvolutionPath(["Agumon", "Gabumon", "Kunemon", "Sukamon"]);
EvolutionPaths["Tokomon"] = new EvolutionPath(["Patamon", "Biyomon", "Kunemon", "Sukamon"]);
EvolutionPaths["Tsunomon"] = new EvolutionPath(["Elecmon", "Penguinmon", "Kunemon", "Sukamon"]);
EvolutionPaths["Tanemon"] = new EvolutionPath(["Palmon", "Betamon", "Kunemon", "Sukamon"]);
EvolutionPaths["Agumon"] = new EvolutionPath(["Greymon", "Meramon", "Birdramon", "Centarumon", "Monochromon", "Tyrannomon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Gabumon"] = new EvolutionPath(["Centarumon", "Monochromon", "Drimogemon", "Tyrannomon", "Ogremon", "Garurumon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Patamon"] = new EvolutionPath(["Drimogemon", "Tyrannomon", "Ogremon", "Leomon", "Angemon", "Unimon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Elecmon"] = new EvolutionPath(["Leomon", "Angemon", "Bakemon", "Kokatorimon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Biyomon"] = new EvolutionPath(["Birdramon", "Airdramon", "Kokatorimon", "Unimon", "Kabuterimon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Kunemon"] = new EvolutionPath(["Bakemon", "Kabuterimon", "Kuwagamon", "Vegiemon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Palmon"] = new EvolutionPath(["Kuwagamon", "Vegiemon", "Ninjamon", "Whamon", "Coelamon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Betamon"] = new EvolutionPath(["Seadramon", "Whamon", "Shellmon", "Coelamon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Penguinmon"] = new EvolutionPath(["Whamon", "Shellmon", "Garurumon", "Frigimon", "Mojyamon", "Numemon", "Nanimon", "Sukamon"]);
EvolutionPaths["Greymon"] = new EvolutionPath(["MetalGreymon", "SkullGreymon", "Vademon", "Sukamon"]);
EvolutionPaths["Meramon"] = new EvolutionPath(["MetalGreymon", "Andromon", "Vademon", "Sukamon"]);
EvolutionPaths["Birdramon"] = new EvolutionPath(["Phoenixmon", "Vademon", "Sukamon"]);
EvolutionPaths["Centarumon"] = new EvolutionPath(["Andromon", "Giromon", "Vademon", "Sukamon"]);
EvolutionPaths["Monochromon"] = new EvolutionPath(["MetalGreymon", "MetalMamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Drimogemon"] = new EvolutionPath(["MetalGreymon", "Vademon", "Sukamon"]);
EvolutionPaths["Tyrannomon"] = new EvolutionPath(["MetalGreymon", "Megadramon", "Vademon", "Sukamon"]);
EvolutionPaths["Devimon"] = new EvolutionPath(["SkullGreymon", "Megadramon", "Vademon", "Sukamon"]);
EvolutionPaths["Ogremon"] = new EvolutionPath(["Andromon", "Giromon", "Vademon", "Sukamon"]);
EvolutionPaths["Leomon"] = new EvolutionPath(["Andromon", "Mamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Angemon"] = new EvolutionPath(["Andromon", "Phoenixmon", "Devimon", "Vademon", "Sukamon"]);
EvolutionPaths["Bakemon"] = new EvolutionPath(["SkullGreymon", "Giromon", "Vademon", "Sukamon"]);
EvolutionPaths["Airdramon"] = new EvolutionPath(["Megadramon", "Phoenixmon", "Vademon", "Sukamon"]);
EvolutionPaths["Kokatorimon"] = new EvolutionPath(["Phoenixmon", "Piximon", "Vademon", "Sukamon"]);
EvolutionPaths["Unimon"] = new EvolutionPath(["Giromon", "Phoenixmon", "Vademon", "Sukamon"]);
EvolutionPaths["Kabuterimon"] = new EvolutionPath(["H-Kabuterimon", "MetalMamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Kuwagamon"] = new EvolutionPath(["H-Kabuterimon", "Piximon", "Vademon", "Sukamon"]);
EvolutionPaths["Vegiemon"] = new EvolutionPath(["Piximon", "Vademon", "Sukamon"]);
EvolutionPaths["Ninjamon"] = new EvolutionPath(["Piximon", "MetalMamemon", "Mamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Seadramon"] = new EvolutionPath(["Megadramon", "MegaSeadramon", "Vademon", "Sukamon"]);
EvolutionPaths["Whamon"] = new EvolutionPath(["MegaSeadramon", "Mamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Shellmon"] = new EvolutionPath(["H-Kabuterimon", "MegaSeadramon", "Vademon", "Sukamon"]);
EvolutionPaths["Coelamon"] = new EvolutionPath(["MegaSeadramon", "Vademon", "Sukamon"]);
EvolutionPaths["Garurumon"] = new EvolutionPath(["SkullGreymon", "MegaSeadramon", "Vademon", "Sukamon"]);
EvolutionPaths["Frigimon"] = new EvolutionPath(["MetalMamemon", "Mamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Mojyamon"] = new EvolutionPath(["SkullGreymon", "Mamemon", "Vademon", "Sukamon"]);
EvolutionPaths["Numemon"] = new EvolutionPath(["Monzaemon", "Vademon", "Sukamon"]);
EvolutionPaths["Sukamon"] = new EvolutionPath(["Etemon", "Vademon"]); 
EvolutionPaths["Nanimon"] = new EvolutionPath(["Digitamamon", "Vademon", "Sukamon"]);
EvolutionPaths["MetalGreymon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Andromon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["SkullGreymon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Megadramon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Giromon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Phoenixmon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["H-Kabuterimon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Piximon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["MetalMamemon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Mamemon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["MegaSeadramon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Monzaemon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Vademon"] = new EvolutionPath([]);
EvolutionPaths["Digitamamon"] = new EvolutionPath(["Sukamon"]);
EvolutionPaths["Etemon"] = new EvolutionPath([]);

/* define all Digimon and their stats/statgains */
var Digimons = {};

//Digimons["name"] = new Digimon("Name", new StatsGains(HP, MP, Off, Def, Spd, Brains), (hp, mp, offense, defense, speed, brains, care, weight, discipline, happiness, battles, techs, minCare, minBattles, digimonBonus));
//Digimons["name"] = new Digimon("Name", new StatsGains(HP, MP, Off, Def, Spd, Brains), new EvolutionRequirements(HP, MP, Off, Def, Spd, Brains, Care, Weight, battles, techs, Happy, Disc, minBattles, minCare, digimonBonus));
Digimons["Agumon"] = new Digimon("Agumon", new StatsGains(1000, 500, 100, 50, 50, 50), new EvolutionRequirements(10, 10, 1, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Airdramon"] = new Digimon("Airdramon", new StatsGains(1500, 2000, 150, 150, 200, 200), new EvolutionRequirements(0, 1000, 0, 0, 100, 100, 1, 30, 90, 0, -1, 35, true, false));
Digimons["Andromon"] = new Digimon("Andromon", new StatsGains(4000, 6000, 400, 600, 400, 600), new EvolutionRequirements(2000, 4000, 200, 400, 200, 400, 5, 40, 95, 0, 30, 30, true, false));
Digimons["Angemon"] = new Digimon("Angemon", new StatsGains(1500, 2000, 150, 150, 150, 250), new EvolutionRequirements(0, 1000, 0, 0, 0, 100, 0, 20, 0, 0, -1, 35, true, false, "Patamon"));
Digimons["Bakemon"] = new Digimon("Bakemon", new StatsGains(1500, 2500, 150, 100, 150, 100), new EvolutionRequirements(0, 1000, 0, 0, 0, 0, 3, 20, 0, 50, -1, 28, false, false));
Digimons["Betamon"] = new Digimon("Betamon", new StatsGains(1000, 500, 50, 100, 50, 50), new EvolutionRequirements(10, 10, 0, 1, 0, 0, 0, 15, 0, 0, -2, 0, false, false, "Tanemon"));
Digimons["Birdramon"] = new Digimon("Birdramon", new StatsGains(1500, 1500, 150, 100, 250, 150), new EvolutionRequirements(0, 0, 0, 0, 100, 0, 3, 20, 0, 0, -1, 35, false, false, "Biyomon"));
Digimons["Biyomon"] = new Digimon("Biyomon", new StatsGains(500, 1000, 50, 50, 100, 50), new EvolutionRequirements(0, 10, 0, 1, 1, 0, 0, 15, 0, 0, -2, 0, false, false, "Tokomon"));
Digimons["Botamon"] = new Digimon("Botamon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Centarumon"] = new Digimon("Centarumon", new StatsGains(1500, 1500, 150, 150, 150, 250), new EvolutionRequirements(0, 0, 0, 0, 0, 100, 3, 30, 60, 0, -1, 28, true, false));
Digimons["Coelamon"] = new Digimon("Coelamon", new StatsGains(1500, 1500, 150, 200, 150, 150), new EvolutionRequirements(0, 0, 0, 100, 0, 0, 3, 30, 0, 0, 5, 35, false, true));
Digimons["Devimon"] = new Digimon("Devimon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Digitamamon"] = new Digimon("Digitamamon", new StatsGains(5000, 5000, 600, 600, 600, 500), new EvolutionRequirements(3000, 3000, 400, 400, 400, 300, 0, 10, 0, 0, 100, 49, true, false));
Digimons["Drimogemon"] = new Digimon("Drimogemon", new StatsGains(1500, 1500, 250, 150, 150, 150), new EvolutionRequirements(0, 0, 100, 0, 0, 0, 3, 40, 0, 50, -1, 28, false, false));
Digimons["Elecmon"] = new Digimon("Elecmon", new StatsGains(500, 500, 100, 50, 100, 50), new EvolutionRequirements(10, 0, 1, 0, 1, 0, 0, 15, 0, 0, -2, 0, false, false, "Tsunomon"));
Digimons["Etemon"] = new Digimon("Etemon", new StatsGains(4000, 5000, 600, 400, 600, 500), new EvolutionRequirements(2000, 3000, 400, 200, 400, 300, 0, 15, 0, 0, 50, 49, true, false));
Digimons["Frigimon"] = new Digimon("Frigimon", new StatsGains(1500, 2000, 100, 150, 150, 200), new EvolutionRequirements(0, 1000, 0, 0, 0, 100, 5, 30, 0, 50, -1, 28, true, false));
Digimons["Gabumon"] = new Digimon("Gabumon", new StatsGains(500, 500, 50, 100, 100, 50), new EvolutionRequirements(0, 0, 0, 1, 1, 1, 0, 15, 0, 0, -2, 0, false, false, "Koromon"));
Digimons["Garurumon"] = new Digimon("Garurumon", new StatsGains(1500, 1500, 150, 200, 150, 150), new EvolutionRequirements(0, 1000, 0, 0, 100, 0, 1, 30, 90, 0, -1, 28, true, false));
Digimons["Giromon"] = new Digimon("Giromon", new StatsGains(3000, 3000, 600, 600, 500, 600), new EvolutionRequirements(0, 0, 400, 0, 300, 400, 15, 5, 0, 95, 100, 35, false, false));
Digimons["Greymon"] = new Digimon("Greymon", new StatsGains(2000, 1500, 200, 200, 200, 200), new EvolutionRequirements(0, 0, 100, 100, 100, 100, 1, 30, 90, 0, -1, 35, true, false));
Digimons["H-Kabuterimon"] = new Digimon("H-Kabuterimon", new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(7000, 0, 400, 600, 400, 0, 5, 55, 0, 0, 0, 40, true, true));
Digimons["Kabuterimon"] = new Digimon("Kabuterimon", new StatsGains(2000, 1500, 200, 200, 200, 100), new EvolutionRequirements(1000, 1000, 100, 0, 100, 0, 1, 30, 0, 0, -1, 35, true, false, "Kunemon"));
Digimons["Kokatorimon"] = new Digimon("Kokatorimon", new StatsGains(2500, 1500, 100, 150, 150, 150), new EvolutionRequirements(1000, 0, 0, 0, 0, 0, 3, 30, 0, 0, -1, 28, false, false, "Biyomon"));
Digimons["Koromon"] = new Digimon("Koromon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Kunemon"] = new Digimon("Kunemon", new StatsGains(1000, 1000, 50, 50, 50, 50), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Kuwagamon"] = new Digimon("Kuwagamon", new StatsGains(2000, 2000, 200, 150, 200, 100), new EvolutionRequirements(1000, 1000, 100, 0, 100, 0, 5, 30, 0, 0, -1, 28, false, false, "Kunemon"));
Digimons["Leomon"] = new Digimon("Leomon", new StatsGains(1500, 1500, 250, 150, 200, 200), new EvolutionRequirements(0, 0, 100, 0, 100, 100, 1, 20, 0, 0, 10, 35, true, false));
Digimons["Mamemon"] = new Digimon("Mamemon", new StatsGains(3000, 3000, 600, 500, 500, 600), new EvolutionRequirements(0, 0, 400, 300, 300, 400, 15, 5, 0, 90, -1, 25, false, false));
Digimons["Megadramon"] = new Digimon("Megadramon", new StatsGains(6000, 6000, 600, 500, 600, 500), new EvolutionRequirements(3000, 5000, 500, 300, 400, 400, 10, 55, 0, 0, 30, 30, true, false));
Digimons["MegaSeadramon"] = new Digimon("MegaSeadramon", new StatsGains(3000, 6000, 600, 600, 300, 600), new EvolutionRequirements(0, 4000, 500, 400, 0, 400, 5, 30, 0, 0, 0, 40, true, true));
Digimons["Meramon"] = new Digimon("Meramon", new StatsGains(1000, 1500, 250, 150, 150, 150), new EvolutionRequirements(0, 0, 100, 0, 0, 0, 5, 20, 0, 0, 10, 28, false, false));
Digimons["MetalGreymon"] = new Digimon("MetalGreymon", new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(4000, 3000, 500, 500, 300, 300, 10, 65, 95, 0, 30, 30, true, false));
Digimons["MetalMamemon"] = new Digimon("MetalMamemon", new StatsGains(3000, 3000, 600, 600, 600, 500), new EvolutionRequirements(0, 0, 500, 400, 400, 400, 15, 10, 0, 95, -1, 30, true, false));
Digimons["Mojyamon"] = new Digimon("Mojyamon", new StatsGains(2000, 1500, 150, 150, 150, 150), new EvolutionRequirements(1000, 0, 0, 0, 0, 0, 5, 20, 0, 0, 5, 28, false, true));
Digimons["Monochromon"] = new Digimon("Monochromon", new StatsGains(2000, 1500, 150, 250, 150, 200), new EvolutionRequirements(1000, 0, 0, 100, 0, 100, 3, 40, 0, 0, 5, 35, true, true));
Digimons["Monzaemon"] = new Digimon("Monzaemon", new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(3000, 3000, 300, 300, 300, 300, 0, 40, 0, 0, 50, 49, true, false));
Digimons["Nanimon"] = new Digimon("Nanimon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Ninjamon"] = new Digimon("Ninjamon", new StatsGains(1500, 2000, 200, 150, 200, 150), new EvolutionRequirements(0, 1000, 100, 0, 100, 0, 1, 10, 0, 0, 15, 35, true, false));
Digimons["Numemon"] = new Digimon("Numemon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Ogremon"] = new Digimon("Ogremon", new StatsGains(2500, 1000, 250, 150, 150, 100), new EvolutionRequirements(1000, 0, 100, 0, 0, 0, 5, 30, 0, 0, 15, 35, false, false));
Digimons["Palmon"] = new Digimon("Palmon", new StatsGains(500, 1000, 50, 50, 50, 100), new EvolutionRequirements(0, 10, 0, 0, 1, 1, 0, 15, 0, 0, -2, 0, false, false, "Tanemon"));
Digimons["Patamon"] = new Digimon("Patamon", new StatsGains(500, 500, 100, 50, 50, 100), new EvolutionRequirements(10, 0, 1, 0, 0, 1, 0, 15, 0, 0, -2, 0, false, false, "Tokomon"));
Digimons["Penguinmon"] = new Digimon("Penguinmon", new StatsGains(500, 500, 50, 100, 50, 100), new EvolutionRequirements(0, 10, 0, 1, 0, 1, 0, 15, 0, 0, -2, 0, false, false, "Tsunomon"));
Digimons["Phoenixmon"] = new Digimon("Phoenixmon", new StatsGains(6000, 6000, 400, 400, 600, 600), new EvolutionRequirements(4000, 4000, 0, 0, 400, 600, 3, 30, 100, 0, 0, 40, true, true));
Digimons["Piximon"] = new Digimon("Piximon", new StatsGains(3000, 3000, 500, 500, 600, 600), new EvolutionRequirements(0, 0, 300, 300, 400, 400, 15, 5, 0, 95, -1, 25, false, false));
Digimons["Poyomon"] = new Digimon("Poyomon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Punimon"] = new Digimon("Punimon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Seadramon"] = new Digimon("Seadramon", new StatsGains(2000, 2000, 150, 150, 100, 150), new EvolutionRequirements(1000, 1000, 0, 0, 0, 0, 3, 30, 0, 0, 5, 28, false, true));
Digimons["Shellmon"] = new Digimon("Shellmon", new StatsGains(2000, 1500, 150, 250, 100, 100), new EvolutionRequirements(1000, 0, 0, 100, 0, 0, 5, 40, 0, 0, -1, 35, false, false, "Betamon"));
Digimons["SkullGreymon"] = new Digimon("SkullGreymon", new StatsGains(5000, 5000, 600, 600, 400, 400), new EvolutionRequirements(4000, 6000, 400, 400, 200, 500, 10, 30, 0, 0, 40, 45, false, false));
Digimons["Sukamon"] = new Digimon("Sukamon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tanemon"] = new Digimon("Tanemon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tokomon"] = new Digimon("Tokomon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tsunomon"] = new Digimon("Tsunomon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tyrannomon"] = new Digimon("Tyrannomon", new StatsGains(2000, 1500, 150, 200, 150, 150), new EvolutionRequirements(1000, 0, 0, 100, 0, 0, 5, 30, 0, 0, 5, 28, true, true));
Digimons["Unimon"] = new Digimon("Unimon", new StatsGains(2000, 1500, 150, 150, 200, 150), new EvolutionRequirements(1000, 0, 0, 0, 100, 0, 3, 30, 0, 0, 10, 35, true, false));
Digimons["Vademon"] = new Digimon("Vademon", new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Vegiemon"] = new Digimon("Vegiemon", new StatsGains(1500, 2000, 100, 150, 150, 100), new EvolutionRequirements(0, 1000, 0, 0, 0, 0, 5, 10, 0, 50, -1, 21, false, false));
Digimons["Whamon"] = new Digimon("Whamon", new StatsGains(2500, 1500, 100, 150, 100, 200), new EvolutionRequirements(1000, 0, 0, 0, 0, 100, 5, 40, 60, 0, -1, 28, true, false));
Digimons["Yuramon"] = new Digimon("Yuramon", new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));

$("body").ready(function() {
  for(var k in Digimons) {
    $(".digimonList").append("<option class='digimon' style='background-image: url(\"./imgs/" + k + ".png\")'>" + k + "</option>");
  }
});

function getDigimon(name) {
  return Digimons[name];
}

function getEvolutionPath(name) {
  return EvolutionPaths[name];
}

function updateEvolutionText() {
  var output = $("#output")
  output.empty();

  var current = getDigimon($("#current").val());
  var target = getDigimon($("#target").val());
  
  $("#current").css("background-image", "url('./imgs/" + current.name + ".gif')");
  $("#target").css("background-image", "url('./imgs/" + target.name + ".gif')");
  
  var hp = $("#hp").val();
  var mp = $("#mp").val();
  var off = $("#offense").val();
  var def = $("#defense").val();
  var spd = $("#speed").val();
  var brains = $("#brains").val();
  
  var weight = $("#weight").val();
  var care = $("#care").val();
  
  var happiness = $("#happy").val();
  var discipline = $("#discipline").val();
  var techs = $("#techs").val();
  var battles = $("#battles").val();
    
  var canEvolveTo = getEvolutionPath(current.name).canEvolveTo(target.name);
  
  if(!canEvolveTo) {
    var paths = getEvolutionPath(current.name).getPaths(target.name);
    if(!$.isEmptyObject(paths)) {
      output.append("<p>" + current.name + " can't evolve directly into " + target.name + ". Follow one of these paths to get " + target.name + ".</p>");
    } else {
      output.append("<p>" + current.name + " can't evolve into " + target.name + ".</p>");
    }
    
    for(var k in paths) {
      output.append("<p>" + current.name + " -> " + paths[k] + "</p>");
    }
    
    return;
  }
  
  var requirements = target.fulfillsRequirements(current.name, hp, mp, off, def, spd, brains, care, weight, happiness, discipline, battles, techs);
  var scores = {};
  var enabled = {};
  
  var targets = getEvolutionPath(current.name).targets;
  
  for(var v in targets) {
    scores[targets[v]] = getDigimon(targets[v]).requirements.calculatePriorityValue(hp, mp, off, def, spd, brains);
    enabled[targets[v]] = getDigimon(targets[v]).fulfillsRequirements(current.name, hp, mp, off, def, spd, brains, care, weight, happiness, discipline, battles, techs)
  }
    
  if(isSpecialEvolution(target)) {
    output.append("<p>" + getSpecialOutput(target) + "<p>");
  }
  else if(requirements) {
    output.append("<p>Congratulations, you fulfill enough requirements to get " + target.name + "! <br /> Please take a look at the priority table below to make sure you get the Digimon you want.</p>");
  } else {
    output.append("<p>You currently do not fulfill enough requirements to get " + target.name + ".</p>");
    
    if(!target.requirements.fulfillStats(hp, mp, off, def, spd, brains)) {
      var str = "You have to raise your stat(s) at least to : ";
      if(target.requirements.hp != 0)
        str += target.requirements.hp + " HP, ";
      if(target.requirements.mp != 0)
        str += target.requirements.mp + " MP, ";
      if(target.requirements.offense != 0)
        str += target.requirements.offense + " Offense, ";
      if(target.requirements.defense != 0)
        str += target.requirements.defense + " Defense, ";
      if(target.requirements.speed != 0)
        str += target.requirements.speed + " Speed, ";
      if(target.requirements.brains != 0)
        str += target.requirements.brains + " Brains, ";
      
      str = str.substring(0, str.length - 2);
      output.append("<p>" + str + ".</p>");
    }
    
    if(!target.requirements.fulfillWeight(weight)) {
      output.append("<p>Adjust your weight to be between " + (target.requirements.weight - 5) + " and " + (target.requirements.weight + 5) + ".</p>");
    }
    
    if(!target.requirements.fulfillCare(care) && !target.requirements.minCare) {
      output.append("<p>You require " + (target.requirements.care - care) + " more care mistakes.</p>");
    }
    
    if(!target.requirements.fulfillBonus(happiness, discipline, battles, techs, current.name)) {
      var str = "<p>In order to fulfill the bonus criteria you have to either: <ul>";
      
      if(target.requirements.battles >= 0) {
        if(!target.requirements.minBattles && target.requirements.battles > battles) {
          str += "<li>Fight at least " + (target.requirements.battles - battles) + " more battles</li>";
        } else if(target.requirements.minBattles && target.requirements.battles - battles >= 0){
          str += "<li>Fight no more than " + (target.requirements.battles - battles) + " more battles</li>";
        }
      }
      
      if(target.requirements.happiness != 0) {
        str += "<li>Raise your happiness to " + target.requirements.happiness + "</li>";
      }
      if(target.requirements.discipline != 0) {
        str += "<li>Raise your discipline to " + target.requirements.discipline + "</li>";
      }
      if(target.requirements.techs != 0) {
        str += "<li>Raise your number of mastered techs to " + target.requirements.techs + "</li>";
      }
      
      str += "<ul>";
      
      output.append(str);
    }
    
    
  }
  
  if(target.requirements.fulfillCare(care) && target.requirements.minCare) {
    output.append("<p>You are allowed to do " + (target.requirements.care - care) + " more care mistakes.</p>");
  }
    
  if(target.requirements.battles >= 0 && target.requirements.minBattles && target.requirements.battles >= battles) {
    output.append("<p>Fight no more than " + (target.requirements.battles - battles) + " more battles.</p>");
  }
  
  addPriorityTable(output, scores, enabled);
}

function getSpecialOutput(target) {
  switch(target.name) {
    case "Devimon":
      return "Lose a battle with your Angemon while having <50% discipline and you'll have a chance to evolve into Devimon.";
    case "Numemon":
      return "Make sure you have no other evolution enabled and you'll evolve into Numemon after 96h on the Rookie level.";
    case "Sukamon":
      return "Fill your virus bar by pooping on the ground."
    case "Nanimon":
      return "Bring happiness and discipline to 0 and scold you Digimon. The easiest way to do so is praising/scolding and then reducing the last bit of discipline by overfeeding. The fly/flower condition will increase your happiness and prevents you from getting this evolution!";
    case "Vademon":
      return "Make sure you have no other evolution enabled and you can evolve into Vademon when praising/scolding your Digimon after 240h on the Champion level.";
    case "Kunemon":
      return "Sleep in Kunemon's bed and you'll have a chance to evolve into Kunemon.";
    default: 
      return "";
  }
}

function isSpecialEvolution(target) {
  switch(target.name) {
    case "Devimon":
    case "Numemon":
    case "Sukamon":
    case "Nanimon":
    case "Vademon":
    case "Kunemon":
      return true;
    default: 
      return false;
  }
}

function addPriorityTable(output, scores, enabled) {
  var appendString = "<table class='priority'>";
  
  appendString += "<tr><th>Digimon</th><th>Score</th><th>Priority Stats</th><th>Enabled</th></tr>";
  
  var prioritized = getPrioritizedDigimon(scores, enabled);
  console.log(prioritized + "test");
  
  for(var v in scores) {
    if(isSpecialEvolution(getDigimon(v)))
      continue;
      
    appendString += "<tr";
    if(v == prioritized)
      appendString += " class='prioritized'";
      
    appendString += "><td>" + v + "</td><td class='score'>" + scores[v] + "</td><td>" + getDigimon(v).getPriorityStats() + "</td><td>" + enabled[v] + "</td></tr>";
  }
  
  appendString += "</table>";
  output.append(appendString);
}

function getPrioritizedDigimon(scores, enabled) {
  var digi;
  
  for(var v in scores) {
    if(isSpecialEvolution(getDigimon(v)) || !enabled[v])
      continue;
      
    if(scores[v] > (digi === undefined ? 0 : scores[digi]))
      digi = v;
    else
      return digi;
  }
  
  return digi;
}

function updateStatsgainText() {
  var digimon = getDigimon($("#target").val());
  var hp = $("#hp").val();
  var mp = $("#mp").val();
  var off = $("#offense").val();
  var def = $("#defense").val();
  var spd = $("#speed").val();
  var brains = $("#brains").val();
 
  $("#target").css("background-image", "url('./imgs/" + digimon.name + ".gif')");
 
  var gainHP = digimon.calculateStatsGain("hp", hp);
  var gainMP = digimon.calculateStatsGain("mp", mp);
  var gainOffense = digimon.calculateStatsGain("offense", off);
  var gainDefense = digimon.calculateStatsGain("defense", def);
  var gainSpeed = digimon.calculateStatsGain("speed", spd);
  var gainBrains = digimon.calculateStatsGain("brains", brains);
  
  $("#gainHP").text(getAddedStats(parseInt(hp), gainHP) + " (gained: " + gainHP + ")");
  $("#gainMP").text(getAddedStats(parseInt(mp), gainMP) + " (gained: " + gainMP + ")");
  $("#gainOff").text(getAddedStats(parseInt(off), gainOffense) + " (gained: " + gainOffense + ")");
  $("#gainDef").text(getAddedStats(parseInt(def), gainDefense) + " (gained: " + gainDefense + ")");
  $("#gainSpeed").text(getAddedStats(parseInt(spd), gainSpeed) + " (gained: " + gainSpeed + ")");
  $("#gainBrains").text(getAddedStats(parseInt(brains), gainBrains) + " (gained: " + gainBrains + ")");
}

function getAddedStats(first, second) {
  if(isNaN(first))
    first = 0;
    
  return first + second;
}