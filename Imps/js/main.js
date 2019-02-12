//"Attila"
class Phyt {
    constructor([x, y], size) {
        this.selfX = x, this.selfY = y, this.size = size;
    }
    display() {
        let self = [this.selfX, this.selfY];
        return self;
    }//return information needed for display (pretty basic)
    baby(phytCo, impCo) {
        let babies = [], size = this.size, selfX = this.selfX, selfY = this.selfY;
        for (let i = -1; i < 2; i++) {//-1 to +1 from current x coordinate
            for (let j = -1; j < 2; j++) {//-1 to +1 from current y coordinate
                if (selfX + i * size >= 0 && selfX + i * size <= 200 - size &&
                    selfY + j * size >= 0 && selfY + j * size <= 200 - size) {//within bounds of display
                    if (Math.abs(i) + Math.abs(j) > 0) {//not the same location
                        babies.push([selfX + i * size, selfY + j * size]);
                    }
                }
            }
        }
        function arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length)
                return false;
            for (let i = arr1.length; i--;) {
                if (arr1[i] !== arr2[i])
                    return false;
            }

            return true;
        }//check if 2 arrays are equal
        for (let i = 0; i < phytCo.length; i++) {
            babies = babies.filter(function (array) {//not equal to an existing phyt
                return !arraysEqual(array, phytCo[i]);
            });
        } for (let i = 0; i < impCo.length; i++) {
            babies = babies.filter(function (array) {//not equal to an existing imp
                return !arraysEqual(array, impCo[i]);
            });
        }
        let rand = Math.random();
        if (babies.length > 0) {//pick random baby
            rand = rand * babies.length;
            for (let i = babies.length - 1; i >= 0; i--) {
                if (i <= rand) {
                    return babies[i];
                }
            }
        } else {// if no available baby spots: return null/
            return null;
        }
    }
}//Phyt class: plant equivalent
class Imp {
    constructor([x, y], size) {
        this.pregnant = null;//not born pregnant
        this.selfX = x, this.selfY = y, this.size = size, this.colour = "#e26a80";//starting stuff
        this.age = 0, this.food = 9;
    }
    display() {//information for display
        let self = [this.selfX, this.selfY, this.colour];
        return self;
    }
    update(phytCo, impCo, cycle) {
        let nearPhyts = phytCo, _phytCo = phytCo;
        let nearImps = impCo, _impCo = impCo;
        let check = true, holder;
        this.age++;
        this.food--;
        if (this.food > 10 && this.age > 0) {//more food means longer lifespan and no negative age
            this.age--;
        }
        if (this.age > 8 || this.food === 0) {//limit number of imps
            return "dead";
        }
        nearImps = findNear([this.selfX, this.selfY], nearImps, this.size);
        nearPhyts = findNear([this.selfX, this.selfY], nearPhyts, this.size);
        if (this.food > 6 && nearImps.length > 0 && cycle % 3 === 0) {//if there is enough food, there is nearby imps and they do it only every other other cycle
            check = false;
            let rand = Math.random() * nearImps.length;
            for (let i = nearImps.length - 1; i >= 0; i--) {
                if (i <= rand) {
                    this.pregnant = this.babyDrop(nearImps[0], _phytCo, _impCo);//find place to put baby
                    this.food -= 4;//pregnancy cost food
                }
            }
        }
        if (nearPhyts.length > 0) {//if there are phyts, nearby eat them
            check = false;
            holder = this.eatPhyt(nearPhyts);
        }
        if (check) {//if you haven't had a baby or eaten just go anywhere
            this.moveAnywhere();
            holder = null;
        }
        return holder;
    }

    babyDrop(daddy, phyts, imps) {
        let self = [this.selfX, this.selfY], size = this.size;
        function empties([x, y]) {
            let hold = [];
            for (let i = -1; i < 2; i++) {//-1 to +1 from current x coordinate
                for (let j = -1; j < 2; j++) {//-1 to +1 from current y coordinate
                    if (x + i * size > 0 && y + j * size > 0 && x + i * size < 200 - size && y + j * size < 200 - size) {//within display boundries
                        if (Math.abs(i) + Math.abs(j) > 0) {//not current coordinates
                            hold.push([x + i * size, y + j * size]);
                        }
                    }
                }
            }
            return hold;
        }//fill with nearby coordinates
        let dadSpots = empties(daddy);
        let momSpots = empties(self);
        let doublesForPhyts = [];
        momSpots = momSpots.filter(function (array) {
            for (let i in phyts) {
                if (array[0] === phyts[i][0] && array[1] === phyts[i][1]) {
                    doublesForPhyts.push(array);//add to another array if it is a phyt location
                    return true;
                }
            }
            for (let i in imps) {
                if (array[0] === imps[i][0] && array[1] === imps[i][1]) {
                    return false;//if there is already an imp there, pass
                }
            }
            return true;//if there is nothing there than return true
        });//findDrop near mom
        dadSpots = dadSpots.filter(function (array) {
            for (let i in phyts) {
                if (array[0] === phyts[i][0] && phyts[1] === phyts[i][1]) {
                    doublesForPhyts.push(array);//if there is a phyt add coords to another array
                    return true;
                }
            }
            for (let i in imps) {
                if (array[0] === imps[i][0] && array[1] === imps[i][1]) {
                    return false;//if there is already an imp, pass
                }
            }
            return true;//return true if there is nothing at that location
        });//findDrop near dad
        for (let i in doublesForPhyts) {
            momSpots.push(doublesForPhyts[i]);//gives double chances for phyt locations
        } for (let i in dadSpots) {//add location for dadSpots
            momSpots.push(dadSpots[i]);
        }
        let rand = Math.random() * momSpots.length;
        for (let i = momSpots.length - 1; i >= 0; i--) {
            if (i <= rand) {
                return momSpots[i];//get random location
            }
        }

    }
    eatPhyt(nearPhyts) {//eat nearby phyt
        let rand = Math.random();
        if (this.food < 12) {//food cap
            this.food += 3;//add three food
        }
        for (let i = 1; i <= nearPhyts.length; i++) {//get random phyt
            if (i >= rand * nearPhyts.length) {
                this.selfX = nearPhyts[i - 1][0];
                this.selfY = nearPhyts[i - 1][1];
                this.colour = "#4286f4";
                return nearPhyts[i - 1];
            }
        }
    }
    moveAnywhere() {
        let holder1 = -1, holder2 = -1;
        let counter = 0;
        while (holder1 < 0 || holder2 < 0 || holder1 > 200 || holder2 > 200) {//while the new coords are out of boundshhn
            counter++;
            if (counter > 20) {//stops ridicu-peating
                holder1 = this.selfX;
                holder2 = this.selfY;
                break;
            }
            let rand = Math.random() * 9;
            holder1 = this.selfX + (Math.ceil(rand) % 3 - 1) * this.size;
            holder2 = this.selfY + (Math.ceil(rand / 3) - 2) * this.size;
        }
        this.colour = "#306000";
        this.selfX = holder1, this.selfY = holder2;

        return;
    }

}//Imp class: herbivore equivalent
class LORD {
    constructor(size, phytN, impN) {
        this.test = document.getElementById("test"), this.size = size;
        this.cycle = 0;
        this.allPhyt = [], this.allImp = [], this.allPhytCoords = [], this.allImpCoords = [];
        this.prevPhytCoords = [], this.prevImpCoords = [];
        for (let i = 0; i < phytN; i++) {
            this.allPhyt.push(new Phyt([i * this.size, 0], this.size));//new Phyt([coordX, coordY], size)
            this.allPhytCoords.push(this.allPhyt[i].display());
        }
        for (let i = 0; i < impN; i++) {
            this.allImp.push(new Imp([i * this.size, 40], this.size));//new Imp([coordX, coordY], size)
            this.allImpCoords.push(this.allImp[i].display());
        }
        this.svg = d3.select("svg").attr("width", 200).attr("height", 200);
        this.allDisplay(1);
    }

    allDisplay(disGen) {
        let phytCoords, impCoords;
        if (disGen > 0) {//display current generation or...
            phytCoords = this.allPhytCoords;
            impCoords = this.allImpCoords;
        } else {//...display previous generation
            phytCoords = this.prevPhytCoords;
            impCoords = this.prevImpCoords;
        }
        let size = this.size;
        let rects = this.svg.selectAll("rect")
            .data(phytCoords, (d) => { return d; });//id it!

        rects.exit()
            .remove();
        rects.enter()
            .append("rect")
            .attr("x", function (d) { return d[0]; })
            .attr("y", function (d) { return d[1]; })
            .attr("fill", "#24b733")
            .attr("height", this.size)
            .attr("width", this.size);

        let circ = this.svg.selectAll("circle")
            .data(impCoords, (d) => { return d; });//doing it again!

        circ.exit()
            .remove();
        circ.enter().append("circle")
            .attr("cx", function (d) { return d[0] + size / 2; })//size / 2 offset because circles center wierdly, unlike rects
            .attr("cy", function (d) { return d[1] + size / 2; })
            .attr("fill", function (d) { return d[2]; })
            .attr("r", this.size / 2);
    }
    allUpdate() {
        this.prevPhytCoords = this.allPhytCoords.slice(0);//set previous generation
        this.prevImpCoords = this.allImpCoords.slice(0);//cntd.
        this.cycle++;//add one to cycle number
        this.test.innerHTML = "Cycle: " + this.cycle;
        this.eatenPhyt = [];
        if (Array.isArray(this.allImp) && this.allImp.length) {
            this.impStuff();
        }//if it's worth iterating over imps
        if (Array.isArray(this.allPhyt) && this.allPhyt.length > 0) {
            this.phytStuff();
        }//ditto here


        let stringPhyt = "allPhyt: ", stringImp = "allImp: ", countPhyt = 0, countImp = 0;
        for (let i in this.allPhyt) {
            if (i < 6) {//show information for first 6
                stringPhyt += this.allPhytCoords[i] + "; ";
            } else {
                countPhyt++;
            }
        }
        if (countPhyt !== 0) {
            stringPhyt += "and " + countPhyt + " more.";
        }

        for (let i in this.allImp) {
            if (i < 6) {//show information for first 6
                stringImp += this.allImpCoords[i] + "; ";
            } else {
                countImp++;
            }
        }
        if (countImp !== 0) {
            stringImp += "and " + countImp + " more.";
        }

        console.log(stringPhyt);
        console.log(stringImp);
        this.allDisplay(1);//auto-displays current generation
    }

    impStuff() {
        for (let i = this.allImp.length - 1; i >= 0; i--) {
            let holde = this.allImp[i].update(this.allPhytCoords, this.allImpCoords, this.cycle);//holde will return dead if it dies, the coordinates of the plant it eat if this is true, or null if it just moves wherever
            if (holde !== "dead") {
                this.allImpCoords[i] = this.allImp[i].display();
                if (this.allImp[i].pregnant) {//is it pregnant
                    this.allImp.push(new Imp(this.allImp[i].pregnant, this.size));//.pregnant is the coords of the baby
                    this.allImpCoords.push(this.allImp[this.allImp.length - 1].display());//push new imp coords
                    this.allImp[i].pregnant = null;
                }
                if (holde) {
                    if (holde.length > 0) {
                        this.eatenPhyt.push(holde);
                    }
                }
            } else {//if it is dead:
                this.allImp.splice(i, 1);//remove from both lists
                this.allImpCoords.splice(i, 1);
            }
        }
    }
    phytStuff() {
        allPhytLoop: for (let i = this.allPhyt.length - 1; i >= 0; i--) {//for each phyt
            for (let j = 0; j < this.eatenPhyt.length; j++) {//check if the phyt is one of the daed
                if (this.allPhyt[i].selfX === this.eatenPhyt[j][0]) {
                    this.allPhyt.splice(i, 1);
                    this.allPhytCoords.splice(i, 1);
                    if (i === 0) {//if that is the last just break because it might be an empty array
                        break allPhytLoop;
                    }
                    continue allPhytLoop;
                }
            }
            let boo = this.allPhyt[i].baby(this.allPhytCoords, this.allImpCoords);//check for space to place baby
            if (!!boo) {//bool statment checks for undefined
                this.allPhytCoords.push(boo);//adds baby
                this.allPhyt.push(new Phyt(boo, this.size));
            }
            let boo2 = this.allPhyt[i].baby(this.allPhytCoords, this.allImpCoords);
            if ((this.cycle + 1) % 2 === 0 && !!boo2) {//every other year is extra fruitful
                this.allPhytCoords.push(boo2);
                this.allPhyt.push(new Phyt(boo2, this.size));
            }
        }
    }
}
function run() {
    let god = new LORD(10, 4, 2);//new LORD(size, phyt starting number, imp starting number)
    let button = document.getElementById("move");
    let button2 = document.getElementById("past");
    let button3 = document.getElementById("curr");
    button.addEventListener("click", () => {
        god.allUpdate();
    });
    button2.addEventListener("click", () => {
        god.allDisplay(0);//displays previous setup
    });
    button3.addEventListener("click", () => {
        god.allDisplay(1);//display current setup
    });
}
function findNear([currX, currY], targetCoords, maxDist) {//finds the nested arrays of the array near the curr coords
    let test = targetCoords.filter(function (array) {
        let num = Math.abs(currX - array[0]) + Math.abs(currY - array[1]);
        if (num <= 2 * maxDist && num > 0) {//manhatten distance
            return true;
        } else {
            return false;
        }
    });
    return test;
}

window.onload = run();