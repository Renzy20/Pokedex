// Search Button Event Listener
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("pokemon-search").value.toLowerCase();
  const detailsContainer = document.querySelector(".pokemon-details");
  const pokemonContainer = document.querySelector(".pokemon-container");
  
  // Clear previous details and results
  detailsContainer.innerHTML = '';
  pokemonContainer.innerHTML = '';

  if (query) {
    // Check if the query is numeric (indicating a search by ID)
    if (!isNaN(query)) {
      // Search by ID
      fetchPokemonDataById(query);
    } else {
      // Fetch a list of all Pokémon names (limiting the number of Pokémon for faster loading)
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')  // You can adjust the limit as needed
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch Pokémon list");
          }
          return response.json();
        })
        .then(data => {
          // Filter Pokémon that start with the provided query (initial)
          const matchingPokemons = data.results.filter(pokemon => pokemon.name.startsWith(query));

          if (matchingPokemons.length > 0) {
            // Fetch and display details for each matching Pokémon
            matchingPokemons.forEach(pokemon => fetchPokemonData(pokemon.name));
          } else {
            pokemonContainer.innerHTML = `<p>No Pokémon found with names starting with "${query}"</p>`;
          }
        })
        .catch(error => {
          console.error(error);
          pokemonContainer.innerHTML = `<p>${error.message}</p>`;
        });
    }
  }
});

// Function to fetch and display Pokémon data by ID
function fetchPokemonDataById(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Pokémon not found");
      }
      return response.json();
    })
    .then(data => displayPokemonBox(data))
    .catch(error => {
      document.querySelector(".pokemon-details").innerHTML = `<p>${error.message}</p>`;
    });
}

// Function to fetch and display Pokémon data
function fetchPokemonData(pokemonName) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Pokémon not found");
      }
      return response.json();
    })
    .then(data => displayPokemonBox(data))
    .catch(error => {
      document.querySelector(".pokemon-details").innerHTML = `<p>${error.message}</p>`;
    });
}

// Display Pokémon Card
function displayPokemonBox(pokemon) {
  const pokemonContainer = document.querySelector(".pokemon-container");

  const pokemonCard = `
    <div class="pokemon-card" data-id="${pokemon.id}">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h2>${pokemon.name.toUpperCase()}</h2>
      <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
      <p><strong>ID:</strong> ${pokemon.id}</p> <!-- Display ID here -->
    </div>
  `;

  // Append the new card to the container
  pokemonContainer.innerHTML += pokemonCard;
}

// Fetch Pokémon Details
function fetchPokemonDetails(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Pokémon not found");
      }
      return response.json();
    })
    .then(data => displayPokemonDetails(data))
    .catch(error => {
      document.querySelector(".pokemon-details").innerHTML = `<p>${error.message}</p>`;
    });
}

function displayPokemonDetails(pokemon) {
  const detailsContainer = document.querySelector(".pokemon-details");
  
  // Define color mapping for stats
  const statColors = {
    hp: '#1cee09', 
    attack: '#ff0000', 
    defense: '#1e90ff',
    sp_atk: '#ec2b09',
    sp_def: '#101672', 
    speed: '#888888' 
  };

  detailsContainer.innerHTML = `
    <div class="pokemon-details-card">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h2>${pokemon.name.toUpperCase()}</h2>
      <p><strong>ID:</strong> ${pokemon.id}</p>
      <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
      <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
      <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
      <p><strong>Base Stats:</strong></p>
      <ul>
        <li><strong>HP:</strong> <div class="stat-bar" style="background-color: ${statColors.hp}; width: ${pokemon.stats[0].base_stat / 2}%;">${pokemon.stats[0].base_stat}</div></li>
        <li><strong>Atk:</strong> <div class="stat-bar" style="background-color: ${statColors.attack}; width: ${pokemon.stats[1].base_stat / 2}%;">${pokemon.stats[1].base_stat}</div></li>
        <li><strong>Def:</strong> <div class="stat-bar" style="background-color: ${statColors.defense}; width: ${pokemon.stats[2].base_stat / 2}%;">${pokemon.stats[2].base_stat}</div></li>
        <li><strong>SP Atk:</strong> <div class="stat-bar" style="background-color: ${statColors.sp_atk}; width: ${pokemon.stats[3].base_stat / 2}%;">${pokemon.stats[3].base_stat}</div></li>
        <li><strong>SP Def:</strong> <div class="stat-bar" style="background-color: ${statColors.sp_def}; width: ${pokemon.stats[4].base_stat / 2}%;">${pokemon.stats[4].base_stat}</div></li>
        <li><strong>Speed:</strong> <div class="stat-bar" style="background-color: ${statColors.speed}; width: ${pokemon.stats[5].base_stat / 2}%;">${pokemon.stats[5].base_stat}</div></li>
      </ul>
    </div>
  `;

  // Show Pokémon details
  document.getElementById('pokemonDetails').style.display = 'flex';
}

// Event Delegation for Pokémon Cards
document.querySelector(".pokemon-container").addEventListener("click", (e) => {
  const card = e.target.closest(".pokemon-card");
  if (card) {
    const pokemonId = card.getAttribute("data-id");
    fetchPokemonDetails(pokemonId);
  }
});

// Close Pokémon Details on Outside Click
const pokemonDetails = document.getElementById('pokemonDetails');
window.addEventListener('click', (e) => {
  if (e.target === pokemonDetails) {
    pokemonDetails.style.display = 'none';
  }
});
