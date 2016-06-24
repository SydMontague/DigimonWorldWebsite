/*
 * Honestly, this code is garbage.
 */


function Digimon (name, level, statsGains, requirements) {
  this.name = name;
  this.level = level;
  
  this.statsGains = statsGains;
  this.requirements = requirements;
  
  this.getStatsGains = function(stats) {
    var result = {};
        
    for(var key in stats) {
      result[key] = stats[key] >= statsGains[key] ? Math.floor(statsGains[key] * 0.1) : Math.floor((statsGains[key] - stats[key]) / 2);
    }
    
    return result;
  }  
  
  this.fulfillsRequirements = function(stats, care, weight, bonus) {
    var counter = 0;
    
    if(requirements.fulfillStats(stats)) {
      counter++;
    }
    if(requirements.fulfillCare(care)) {
      counter++;
    }
    if(requirements.fulfillWeight(weight)) {
      counter++;
    }
    if(requirements.fulfillBonus(bonus)) {
      counter++;
    }
      
    return counter >= 3;
  };
}

function EvolutionRequirements (hp, mp, offense, defense, speed, brains, care, weight, discipline, happiness, battles, techs, minCare, minBattles, digimonBonus) {

  this.requiredStats = {};
  this.requiredStats["hp"] = hp;
  this.requiredStats["mp"] = mp;
  this.requiredStats["offense"] = offense;
  this.requiredStats["defense"] = defense;
  this.requiredStats["speed"] = speed;
  this.requiredStats["brains"] = brains;

  this.care = care;
  this.weight = weight;
  this.happiness = happiness;
  this.discipline = discipline;
  this.techs = techs;
  this.battles = battles;
  this.minBattles = minBattles;
  this.minCare = minCare;
  this.digimonBonus = digimonBonus;
  
  this.fulfillStats = function(stats) {
    for(var key in this.requiredStats) {
      if(this.requiredStats[key] != 0 && this.requiredStats[key] > stats[key]) {
        return false;
      }
    }
  
    return true;
  }
    
  this.fulfillCare = function(care) {
    return this.minCare ? care <= this.care : care >= this.care;
  };
  
  this.fulfillWeight = function(weight) {
    return (this.weight - 5) <= weight && (this.weight + 5) >= weight;
  };
  
  this.fulfillBonus = function(bonus) {
    if(this.digimonBonus != undefined && bonus["current"] == this.digimonBonus)
      return true;
      
    if(this.techs != 0 && bonus["techniques"] >= this.techs)
      return true;
      
    if(this.discipline != 0 && bonus["discipline"] >= this.discipline)
      return true;
      
    if(this.happiness != 0 && bonus["happiness"] >= this.happiness)
      return true;
      
    if(this.battles >= 0)
      if(this.minBattles && this.battles >= bonus["battles"])
        return true;
      else if(!this.minBattles && this.battles <= bonus["battles"])
        return true;
        
    return false;
  }
    
  this.calculatePriorityValue = function(stats) {
    var statsSum = 0;
    var statsCounter = 0;
    
    for(var key in this.requiredStats) {
      if(this.requiredStats[key] != 0 && !isNaN(stats[key])) {
        statsSum += parseInt(stats[key]) / (key == "hp" || key == "mp" ? 10 : 1);
        statsCounter++;      
      }
    }
    
    var score = Math.floor(statsSum / statsCounter);
    return isNaN(score) ? 0 : score;
  };
    
  this.getPriorityStats = function() {      
    var string = "";
    
    for(var key in this.requiredStats) {
      if(this.requiredStats[key] != 0) {
        string += "<img src='./imgs/" + key + ".png' width='22' title='≥" + this.requiredStats[key] + " " + statNames[key] + "' />";
      }
    }
    
    return string == "" ? "none" : string;
  }
  
  this.getCareImage = function() {
    return "<img src='./imgs/care.png' width='22' title='" + (this.minCare ? "≤" : "≥") + this.care + " Care Mistakes' />";
  }
  
  this.getWeightImage = function() {
    return "<img src='./imgs/weight.png' width='22' title='" + (this.weight-5) + " to " + (this.weight+5) + " Weight' />";
  }
  
  this.getBonusImages = function() {
    var string = "";
    
    if(this.digimonBonus != undefined)
      string += "<img src='./imgs/" + this.digimonBonus + ".png' width='22' title='Have " + this.digimonBonus + " as Partner' />"
      
    if(this.battles >= 0)
      string += "<img src='./imgs/battle.png' width='22' title='" + (this.minBattles ? "≤" : "≥") + this.battles + " Battles' />";
      
    if(this.discipline != 0)
      string += "<img src='./imgs/discipline.png' width='22' title='≥" + this.discipline + " Discipline' />";
      
    if(this.happiness != 0)
      string += "<img src='./imgs/happiness.png' width='22' title='≥" + this.happiness + " Happiness' />";
      
    if(this.techs != 0)
      string += "<img src='./imgs/techniques.png' width='22' title='≥" + this.techs + " Techniques' />";
      
    return string;
  }
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

var Level = {
  Fresh : 0,
  In_Training: 1,
  Rookie: 2,
  Champion: 3,
  Ultimate: 4
}

/* define all Digimon and their stats/statgains */
var Digimons = {};

//Digimons["name"] = new Digimon("Name", new StatsGains(HP, MP, Off, Def, Spd, Brains), (hp, mp, offense, defense, speed, brains, care, weight, discipline, happiness, battles, techs, minCare, minBattles, digimonBonus));
//Digimons["name"] = new Digimon("Name", new StatsGains(HP, MP, Off, Def, Spd, Brains), new EvolutionRequirements(HP, MP, Off, Def, Spd, Brains, Care, Weight, battles, techs, Happy, Disc, minBattles, minCare, digimonBonus));
Digimons["Agumon"] = new Digimon("Agumon", Level.Rookie, new StatsGains(1000, 500, 100, 50, 50, 50), new EvolutionRequirements(10, 10, 1, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Airdramon"] = new Digimon("Airdramon", Level.Champion, new StatsGains(1500, 2000, 150, 150, 200, 200), new EvolutionRequirements(0, 1000, 0, 0, 100, 100, 1, 30, 90, 0, -1, 35, true, false));
Digimons["Andromon"] = new Digimon("Andromon", Level.Ultimate, new StatsGains(4000, 6000, 400, 600, 400, 600), new EvolutionRequirements(2000, 4000, 200, 400, 200, 400, 5, 40, 95, 0, 30, 30, true, false));
Digimons["Angemon"] = new Digimon("Angemon", Level.Champion, new StatsGains(1500, 2000, 150, 150, 150, 250), new EvolutionRequirements(0, 1000, 0, 0, 0, 100, 0, 20, 0, 0, -1, 35, true, false, "Patamon"));
Digimons["Bakemon"] = new Digimon("Bakemon", Level.Champion, new StatsGains(1500, 2500, 150, 100, 150, 100), new EvolutionRequirements(0, 1000, 0, 0, 0, 0, 3, 20, 0, 50, -1, 28, false, false));
Digimons["Betamon"] = new Digimon("Betamon", Level.Rookie, new StatsGains(1000, 500, 50, 100, 50, 50), new EvolutionRequirements(10, 10, 0, 1, 0, 0, 0, 15, 0, 0, -2, 0, false, false, "Tanemon"));
Digimons["Birdramon"] = new Digimon("Birdramon", Level.Champion, new StatsGains(1500, 1500, 150, 100, 250, 150), new EvolutionRequirements(0, 0, 0, 0, 100, 0, 3, 20, 0, 0, -1, 35, false, false, "Biyomon"));
Digimons["Biyomon"] = new Digimon("Biyomon", Level.Rookie, new StatsGains(500, 1000, 50, 50, 100, 50), new EvolutionRequirements(0, 10, 0, 1, 1, 0, 0, 15, 0, 0, -2, 0, false, false, "Tokomon"));
Digimons["Botamon"] = new Digimon("Botamon", Level.Fresh, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Centarumon"] = new Digimon("Centarumon", Level.Champion, new StatsGains(1500, 1500, 150, 150, 150, 250), new EvolutionRequirements(0, 0, 0, 0, 0, 100, 3, 30, 60, 0, -1, 28, true, false));
Digimons["Coelamon"] = new Digimon("Coelamon", Level.Champion, new StatsGains(1500, 1500, 150, 200, 150, 150), new EvolutionRequirements(0, 0, 0, 100, 0, 0, 3, 30, 0, 0, 5, 35, false, true));
Digimons["Devimon"] = new Digimon("Devimon", Level.Champion, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Digitamamon"] = new Digimon("Digitamamon", Level.Ultimate, new StatsGains(5000, 5000, 600, 600, 600, 500), new EvolutionRequirements(3000, 3000, 400, 400, 400, 300, 0, 10, 0, 0, 100, 49, true, false));
Digimons["Drimogemon"] = new Digimon("Drimogemon", Level.Champion, new StatsGains(1500, 1500, 250, 150, 150, 150), new EvolutionRequirements(0, 0, 100, 0, 0, 0, 3, 40, 0, 50, -1, 28, false, false));
Digimons["Elecmon"] = new Digimon("Elecmon", Level.Rookie, new StatsGains(500, 500, 100, 50, 100, 50), new EvolutionRequirements(10, 0, 1, 0, 1, 0, 0, 15, 0, 0, -2, 0, false, false, "Tsunomon"));
Digimons["Etemon"] = new Digimon("Etemon", Level.Ultimate, new StatsGains(4000, 5000, 600, 400, 600, 500), new EvolutionRequirements(2000, 3000, 400, 200, 400, 300, 0, 15, 0, 0, 50, 49, true, false));
Digimons["Frigimon"] = new Digimon("Frigimon", Level.Champion, new StatsGains(1500, 2000, 100, 150, 150, 200), new EvolutionRequirements(0, 1000, 0, 0, 0, 100, 5, 30, 0, 50, -1, 28, true, false));
Digimons["Gabumon"] = new Digimon("Gabumon", Level.Rookie, new StatsGains(500, 500, 50, 100, 100, 50), new EvolutionRequirements(0, 0, 0, 1, 1, 1, 0, 15, 0, 0, -2, 0, false, false, "Koromon"));
Digimons["Garurumon"] = new Digimon("Garurumon", Level.Champion, new StatsGains(1500, 1500, 150, 200, 150, 150), new EvolutionRequirements(0, 1000, 0, 0, 100, 0, 1, 30, 90, 0, -1, 28, true, false));
Digimons["Giromon"] = new Digimon("Giromon", Level.Ultimate, new StatsGains(3000, 3000, 600, 600, 500, 600), new EvolutionRequirements(0, 0, 400, 0, 300, 400, 15, 5, 0, 95, 100, 35, false, false));
Digimons["Greymon"] = new Digimon("Greymon", Level.Champion, new StatsGains(2000, 1500, 200, 200, 200, 200), new EvolutionRequirements(0, 0, 100, 100, 100, 100, 1, 30, 90, 0, -1, 35, true, false));
Digimons["H-Kabuterimon"] = new Digimon("H-Kabuterimon", new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(7000, 0, 400, 600, 400, 0, 5, 55, 0, 0, 0, 40, true, true));
Digimons["Kabuterimon"] = new Digimon("Kabuterimon", Level.Champion, new StatsGains(2000, 1500, 200, 200, 200, 100), new EvolutionRequirements(1000, 1000, 100, 0, 100, 0, 1, 30, 0, 0, -1, 35, true, false, "Kunemon"));
Digimons["Kokatorimon"] = new Digimon("Kokatorimon", Level.Champion, new StatsGains(2500, 1500, 100, 150, 150, 150), new EvolutionRequirements(1000, 0, 0, 0, 0, 0, 3, 30, 0, 0, -1, 28, false, false, "Biyomon"));
Digimons["Koromon"] = new Digimon("Koromon", Level.In_Training, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Kunemon"] = new Digimon("Kunemon", Level.Rookie, new StatsGains(1000, 1000, 50, 50, 50, 50), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Kuwagamon"] = new Digimon("Kuwagamon", Level.Champion, new StatsGains(2000, 2000, 200, 150, 200, 100), new EvolutionRequirements(1000, 1000, 100, 0, 100, 0, 5, 30, 0, 0, -1, 28, false, false, "Kunemon"));
Digimons["Leomon"] = new Digimon("Leomon", Level.Champion, new StatsGains(1500, 1500, 250, 150, 200, 200), new EvolutionRequirements(0, 0, 100, 0, 100, 100, 1, 20, 0, 0, 10, 35, true, false));
Digimons["Mamemon"] = new Digimon("Mamemon", Level.Ultimate, new StatsGains(3000, 3000, 600, 500, 500, 600), new EvolutionRequirements(0, 0, 400, 300, 300, 400, 15, 5, 0, 90, -1, 25, false, false));
Digimons["Megadramon"] = new Digimon("Megadramon", Level.Ultimate, new StatsGains(6000, 6000, 600, 500, 600, 500), new EvolutionRequirements(3000, 5000, 500, 300, 400, 400, 10, 55, 0, 0, 30, 30, true, false));
Digimons["MegaSeadramon"] = new Digimon("MegaSeadramon", Level.Ultimate, new StatsGains(3000, 6000, 600, 600, 300, 600), new EvolutionRequirements(0, 4000, 500, 400, 0, 400, 5, 30, 0, 0, 0, 40, true, true));
Digimons["Meramon"] = new Digimon("Meramon", Level.Champion, new StatsGains(1000, 1500, 250, 150, 150, 150), new EvolutionRequirements(0, 0, 100, 0, 0, 0, 5, 20, 0, 0, 10, 28, false, false));
Digimons["MetalGreymon"] = new Digimon("MetalGreymon", Level.Ultimate, new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(4000, 3000, 500, 500, 300, 300, 10, 65, 95, 0, 30, 30, true, false));
Digimons["MetalMamemon"] = new Digimon("MetalMamemon", Level.Ultimate, new StatsGains(3000, 3000, 600, 600, 600, 500), new EvolutionRequirements(0, 0, 500, 400, 400, 400, 15, 10, 0, 95, -1, 30, true, false));
Digimons["Mojyamon"] = new Digimon("Mojyamon", Level.Champion, new StatsGains(2000, 1500, 150, 150, 150, 150), new EvolutionRequirements(1000, 0, 0, 0, 0, 0, 5, 20, 0, 0, 5, 28, false, true));
Digimons["Monochromon"] = new Digimon("Monochromon", Level.Champion, new StatsGains(2000, 1500, 150, 250, 150, 200), new EvolutionRequirements(1000, 0, 0, 100, 0, 100, 3, 40, 0, 0, 5, 35, true, true));
Digimons["Monzaemon"] = new Digimon("Monzaemon", Level.Ultimate, new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(3000, 3000, 300, 300, 300, 300, 0, 40, 0, 0, 50, 49, true, false));
Digimons["Nanimon"] = new Digimon("Nanimon", Level.Champion, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Ninjamon"] = new Digimon("Ninjamon", Level.Champion, new StatsGains(1500, 2000, 200, 150, 200, 150), new EvolutionRequirements(0, 1000, 100, 0, 100, 0, 1, 10, 0, 0, 15, 35, true, false));
Digimons["Numemon"] = new Digimon("Numemon", Level.Champion, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Ogremon"] = new Digimon("Ogremon", Level.Champion, new StatsGains(2500, 1000, 250, 150, 150, 100), new EvolutionRequirements(1000, 0, 100, 0, 0, 0, 5, 30, 0, 0, 15, 35, false, false));
Digimons["Palmon"] = new Digimon("Palmon", Level.Rookie, new StatsGains(500, 1000, 50, 50, 50, 100), new EvolutionRequirements(0, 10, 0, 0, 1, 1, 0, 15, 0, 0, -2, 0, false, false, "Tanemon"));
Digimons["Patamon"] = new Digimon("Patamon", Level.Rookie, new StatsGains(500, 500, 100, 50, 50, 100), new EvolutionRequirements(10, 0, 1, 0, 0, 1, 0, 15, 0, 0, -2, 0, false, false, "Tokomon"));
Digimons["Penguinmon"] = new Digimon("Penguinmon", Level.Rookie, new StatsGains(500, 500, 50, 100, 50, 100), new EvolutionRequirements(0, 10, 0, 1, 0, 1, 0, 15, 0, 0, -2, 0, false, false, "Tsunomon"));
Digimons["Phoenixmon"] = new Digimon("Phoenixmon", Level.Ultimate, new StatsGains(6000, 6000, 400, 400, 600, 600), new EvolutionRequirements(4000, 4000, 0, 0, 400, 600, 3, 30, 100, 0, 0, 40, true, true));
Digimons["Piximon"] = new Digimon("Piximon", Level.Ultimate, new StatsGains(3000, 3000, 500, 500, 600, 600), new EvolutionRequirements(0, 0, 300, 300, 400, 400, 15, 5, 0, 95, -1, 25, false, false));
Digimons["Poyomon"] = new Digimon("Poyomon", Level.Fresh, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Punimon"] = new Digimon("Punimon", Level.Fresh, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Seadramon"] = new Digimon("Seadramon", Level.Champion, new StatsGains(2000, 2000, 150, 150, 100, 150), new EvolutionRequirements(1000, 1000, 0, 0, 0, 0, 3, 30, 0, 0, 5, 28, false, true));
Digimons["Shellmon"] = new Digimon("Shellmon", Level.Champion, new StatsGains(2000, 1500, 150, 250, 100, 100), new EvolutionRequirements(1000, 0, 0, 100, 0, 0, 5, 40, 0, 0, -1, 35, false, false, "Betamon"));
Digimons["SkullGreymon"] = new Digimon("SkullGreymon", Level.Ultimate, new StatsGains(5000, 5000, 600, 600, 400, 400), new EvolutionRequirements(4000, 6000, 400, 400, 200, 500, 10, 30, 0, 0, 40, 45, false, false));
Digimons["Sukamon"] = new Digimon("Sukamon", Level.Champion, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tanemon"] = new Digimon("Tanemon", Level.In_Training, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tokomon"] = new Digimon("Tokomon", Level.In_Training, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tsunomon"] = new Digimon("Tsunomon", Level.In_Training, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Tyrannomon"] = new Digimon("Tyrannomon", Level.Champion, new StatsGains(2000, 1500, 150, 200, 150, 150), new EvolutionRequirements(1000, 0, 0, 100, 0, 0, 5, 30, 0, 0, 5, 28, true, true));
Digimons["Unimon"] = new Digimon("Unimon", Level.Champion, new StatsGains(2000, 1500, 150, 150, 200, 150), new EvolutionRequirements(1000, 0, 0, 0, 100, 0, 3, 30, 0, 0, 10, 35, true, false));
Digimons["Vademon"] = new Digimon("Vademon", Level.Ultimate, new StatsGains(5000, 5000, 500, 500, 500, 500), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));
Digimons["Vegiemon"] = new Digimon("Vegiemon", Level.Champion, new StatsGains(1500, 2000, 100, 150, 150, 100), new EvolutionRequirements(0, 1000, 0, 0, 0, 0, 5, 10, 0, 50, -1, 21, false, false));
Digimons["Whamon"] = new Digimon("Whamon", Level.Champion, new StatsGains(2500, 1500, 100, 150, 100, 200), new EvolutionRequirements(1000, 0, 0, 0, 0, 100, 5, 40, 60, 0, -1, 28, true, false));
Digimons["Yuramon"] = new Digimon("Yuramon", Level.Fresh, new StatsGains(0, 0, 0, 0, 0, 0), new EvolutionRequirements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, false, false));

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

var bonusTypes = [ "current", "happiness", "discipline", "techniques", "battles" ];
var statNames = { "hp": "HP", "mp": "MP", "offense": "Offense", "defense": "Defense", "speed": "Speed", "brains": "Brains" };
var statTypes = [ "hp", "mp", "offense", "defense", "speed", "brains" ]; 

function updateEvolutionText() {
  var output = $("#output")
  output.empty();

  var current = getDigimon($("#current").val());
  var target = getDigimon($("#target").val());
  
  $("#current").css("background-image", "url('./imgs/" + current.name + ".gif')");
  $("#target").css("background-image", "url('./imgs/" + target.name + ".gif')");
  
  var stats = {};
  for(var key in statTypes) {
    stats[statTypes[key]] = $("#" + statTypes[key]).val();
  }
  
  var weight = $("#weight").val();
  var care = $("#care").val();
  
  var bonus = {};
  for(var key in bonusTypes) {
    bonus[bonusTypes[key]] = $("#" + bonusTypes[key]).val();
  }
  
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
  
  var requirements = target.fulfillsRequirements(stats, care, weight, bonus);
    
  if(isSpecialEvolution(target)) {
    output.append("<p>" + getSpecialOutput(target) + "<p>");
  }
  else if(requirements) {
    output.append("<p>Congratulations, you fulfill enough requirements to get " + target.name + "! <br /> Please take a look at the priority table below to make sure you get the Digimon you want.</p>");
  } else {
    output.append("<p>You currently do not fulfill enough requirements to get " + target.name + ".</p>");
    
    //not enough stats text
    if(!target.requirements.fulfillStats(stats)) {
      var str = "You have to raise your stat(s) at least to : ";
      
      for(var key in target.requirements.requiredStats) {
        if(target.requirements.requiredStats[key] != 0) {
          str += target.requirements.requiredStats[key] + " " + statNames[key] + ", ";
        }
      }
            
      str = str.substring(0, str.length - 2);
      output.append("<p>" + str + ".</p>");
    }
    
    //weight text
    if(!target.requirements.fulfillWeight(weight)) {
      output.append("<p>Adjust your weight to be between " + (target.requirements.weight - 5) + " and " + (target.requirements.weight + 5) + ".</p>");
    }
    
    //care text
    if(!target.requirements.fulfillCare(care) && !target.requirements.minCare) {
      output.append("<p>You require " + (target.requirements.care - care) + " more care mistakes.</p>");
    }
    else if(target.requirements.fulfillCare(care) && target.requirements.minCare) {
      output.append("<p>You are allowed to do " + (target.requirements.care - care) + " more care mistakes.</p>");
    }
    
    //bonus text
    if(!target.requirements.fulfillBonus(bonus)) {
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
    
  if(target.requirements.battles >= 0 && target.requirements.minBattles && target.requirements.battles >= battles) {
    output.append("<p>Fight no more than " + (target.requirements.battles - bonus["battles"]) + " more battles.</p>");
  }
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

function addPriorityTable() {
  var output = $("#table")
  output.empty();

  var current = getDigimon($("#current").val());
  
  var scores = {};
  var enabled = {};
  
  var targets = getEvolutionPath(current.name).targets;
  
  var stats = {};
  for(var key in statTypes) {
    stats[statTypes[key]] = $("#" + statTypes[key]).val();
  }
  
  var weight = $("#weight").val();
  var care = $("#care").val();
  
  var bonus = {};
  for(var key in bonusTypes) {
    bonus[bonusTypes[key]] = $("#" + bonusTypes[key]).val();
  }
  
  for(var v in targets) {
    if(current.level != Level.In_Training)
      scores[targets[v]] = getDigimon(targets[v]).requirements.calculatePriorityValue(stats);
    else {
      scores[targets[v]] = 0;
      for(var key in getDigimon(targets[v]).requirements.requiredStats)
      {
        var val = stats[key] / (key == "hp" || key == "mp" ? 10 : 1);
        if(getDigimon(targets[v]).requirements.requiredStats[key] != 0 && val > scores[targets[v]])
          scores[targets[v]] = Math.floor(val);
      }
    
    }
    enabled[targets[v]] = getDigimon(targets[v]).fulfillsRequirements(stats, care, weight, bonus);
  }

  var appendString = "<table class='priority'>";
  
  appendString += "<tr><th>Digimon</th><th>Score</th><th colspan='3'>Requirement</th><th>Enabled</th></tr>";
  
  var prioritized = current.level == Level.In_Training ? getPrioritizedRookie(stats, enabled) : getPrioritizedDigimon(scores, enabled);
  
  for(var v in scores) {
    if(isSpecialEvolution(getDigimon(v)))
      continue;
      
    appendString += "<tr";
    if(v == prioritized)
      appendString += " class='prioritized'";
      
    appendString += "><td>" + v + "</td><td class='score'>" + scores[v] + "</td><td>";
    appendString += "<div class='" + (getDigimon(v).requirements.fulfillStats(stats) ? "fulfilled" : "notFulfilled") + "'>";
    appendString += getDigimon(v).requirements.getPriorityStats();
    appendString += "</div></td>";
    appendString += "<td class='requirements'><div class='" + (getDigimon(v).requirements.fulfillCare(care) ? "fulfilled" : "notFulfilled") + "'>";
    appendString += getDigimon(v).requirements.getCareImage();
    appendString += "</div>";
    appendString += "<div class='" + (getDigimon(v).requirements.fulfillWeight(weight) ? "fulfilled" : "notFulfilled") + "'>";
    appendString += getDigimon(v).requirements.getWeightImage();
    appendString += "</div></td>";
    appendString += "<td><div class='" + (getDigimon(v).requirements.fulfillBonus(bonus) ? "fulfilled" : "notFulfilled") + "'>";
    appendString += getDigimon(v).requirements.getBonusImages();
    appendString += "</div></td>";


    appendString += "</td><td>" + enabled[v] + "</td></tr>";
  }
  
  appendString += "</table>";
  output.append(appendString);
  
  $(".priority").tooltip();
}

function getPrioritizedRookie(stats, enabled) {
  var digi;
  var highest = 0;
  
  for(var key in stats) {
    var val = stats[key] / (key == "hp" || key == "mp" ? 10 : 1);
    if(val > highest) {
      highest = val;
      for(var dig in enabled) {
        if(isSpecialEvolution(getDigimon(dig)) || !enabled[dig])
          continue;
          
          if(getDigimon(dig).requirements.requiredStats[key] != 0)
          {
            digi = dig;
            break;
          }
      }
    }
  }
  
  return digi;
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
  
  $("#target").css("background-image", "url('./imgs/" + digimon.name + ".gif')");
  
  var stats = {};
  
  for(var key in statTypes) {
    stats[statTypes[key]] = $("#" + statTypes[key]).val();
  }
  
  var result = digimon.getStatsGains(stats);
  
  for(var key in stats) {
    $("#gain" + key).text(getAddedStats(parseInt(stats[key]), result[key]) + " (gained: " + result[key] + ")"); 
  }
}

function getAddedStats(first, second) {
  if(isNaN(first))
    first = 0;
    
  return first + second;
}