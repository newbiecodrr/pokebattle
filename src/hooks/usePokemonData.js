import { useState, useEffect } from "react";
import axios from "axios";
import Pokemon from "@/classes/pokemon";

export function usePokemonData() {
  const [roster, setRoster] = useState([]);

  // Real network states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Yahan effect ko sirf initial mount par run kara rahe hain, taaki app load hote hi roster ek baar fetch ho aur unnecessary repeat calls na lagen.
    const fetchPokemonData = async () => {
      try {
        // Yahan hum base Pokemon objects bana rahe hain; important baat ye hai ki battle logic wali OOP class same rahe, bas baad mein live API data isme inject hoga.
        const baseStats = {
          pikachu: new Pokemon("Pikachu", 90, 50, 30, 10, 10),
          charizard: new Pokemon("Charizard", 120, 50, 25, 8, 20),
          blastoise: new Pokemon("Blastoise", 160, 50, 18, 10, 35),
          venusaur: new Pokemon("Venusaur", 130, 50, 20, 5, 25),
        };

        // Yahan names ki single source-of-truth list rakh rahe hain, taaki request order aur object mapping dono deterministic rahen.
        const rosterNames = ["pikachu", "charizard", "blastoise", "venusaur"];

        // Yahan hum Promise.all use kar rahe hain taaki saari API requests parallel mein chal sakein; isse sequential waits avoid hote hain aur total loading fast hoti hai.
        const responses = await Promise.all(
          rosterNames.map((name) =>
            axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
          )
        );

        // Axios response ka parsed JSON already `data` ke andar milta hai, to ab hume manually `.json()` call karke response unwrap karne ki zarurat nahi hai.
        // Yahan live API animated GIF ko existing class instances ke saath merge kar rahe hain.
        const fullyLoadedRoster = responses.map((apiData, index) => {
          const name = rosterNames[index];
          const pokemonInstance = baseStats[name];

          // Senior-level tip: Yahan hum direct ID extract kar rahe hain Axios ke data object se aur usko Generation-V ke Black/White animated GIF url mein inject kar rahe hain.
          pokemonInstance.sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${apiData.data.id}.gif`;

          return pokemonInstance;
        });

        // Jab roster fully prepare ho jaye tab ek hi place par state update karo; is pattern se UI ko consistent, ready-to-render data milta hai.
        setRoster(fullyLoadedRoster);
        setIsLoading(false);
      } catch (error) {
        // Error state alag se maintain karna zaruri hai, kyunki junior devs aksar sirf loading band karte hain but UI ko fail-state ka signal dena bhool jaate hain.
        console.error("CRITICAL API FAILURE:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  // Yahan return contract intentionally stable rakha gaya hai, taaki consuming components ko refactor ki wajah se koi breaking change face na karna pade.
  return { roster, isLoading, isError };
} 