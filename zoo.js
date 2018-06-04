/*
    Zoo Exercise
    We are building a zoo inside a computer. Each animal species in our zoo has lots
    of different, particular, behaviors, but all animals talk to each other in a similar
    way. Specifically, they all implement a "speak" method, the output of which is the
    arbitrary input string interspersed with an "animal sound" that is particular to that
    type of animal. For example, the lion's speak function behaves like so:
    lion.speak( "I'm a lion" );
    -> "I'm roar a roar lion roar"
    The tiger's speak function behaves similarly but with a different sound:
    tiger.speak( "Lions suck" );
    -> "Lions grrr suck grrr"
    Please write logic and classes to support our zoo in JavaScript (using whatever
    class model you like) with attention to code structure and readability.
*/

class ZooAnimal
{
    constructor(sound)
    {
        this.sound = sound;
    }

    speak(something)
    {
        //this could be precalculated...
        const words = something.split(" ");
        
        const interspersed = words.map((value)=> {
            return value + " " + this.sound;
        });
        return interspersed.join(" ");
    }
}


const lion = new ZooAnimal("roar");
console.log(lion.speak("I'm a lion"));

const tiger = new ZooAnimal("grrr");
console.log(tiger.speak("Lions suck"));


/*
* ANOTHER OPTION IS TO SPECIFY SUB ANIMAL CLASSES WITH SPECIFIC ANIMAL SOUNDS
* IT ALL BOILS DOWN TO HOW YOU WOULD PREFER TO ARCHITECT IT, EITHER TO HAVE
* JUST A ZOOANIMAL CLASS OR SPECIFIC SUBCLASSES USED.
*/

class Lion extends ZooAnimal
{
    constructor()
    {
        super("|specific roar|");
    }
}

const specificLion = new Lion();
console.log(specificLion.speak("I am about to say something specific"));