import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useBaseEntity} from "../../hooks/useListProvider";
import useAxios from "../../hooks/useAxios";
import styled from "styled-components";

const Container = styled.div`
    display: grid;
    grid-template-columns: 350px 1fr;
    grid-template-areas: 'img details' 
                          'main main';
`;

const Portrait = styled.img`
    width: 100%;
    grid-area: img
`;

const Details = styled.div`
    width: 100%;
    grid-area: details;
  
    p {
      text-transform: capitalize;
    } 
`;

const FlavorTextTable = styled.div`
    overflow: scroll;
    grid-area: main
`;

const GameTitle = styled.p`
  text-transform: capitalize;
  width: 100%;
  padding: 8px 0;
  font-weight: 600;
  color: black;
`;

const useSpecies = (id) => {
    const { response, loading} = useAxios({
        method: 'get',
        url: `/pokemon-species/${id}`,
    });

    return { response, loading };
}

const Display = () => {
    let params  = useParams();
    const { loading, data, fetch } = useBaseEntity(params.category, params.name);

    const detailsResponse = useSpecies(params.name);
    console.log(detailsResponse)
    const flavorText = detailsResponse.response?.flavor_text_entries.filter((entry => entry.language.name === 'en'))

    useEffect(() => {
        if(!data && !loading) fetch()
    }, [])

    let imgURL;
    if(data) {
        switch (params.category) {
            case 'pokemon': {
                imgURL = data.sprites?.other['official-artwork'].front_default;
                break;
            }
            default: {
                imgURL = data.sprites?.default;
                break;
            }
        }
    }

    if(loading || detailsResponse.loading || !data ) return <h1>Loading Display</h1>

    return (
        <Container>
            <Portrait src={imgURL} alt={data.name} />
            <Details>
                <p>Name: {data.name}</p>
                <p>National PokeDex Number: {data.id}</p>
                <p>Height: {data.height / 10} M</p>
                <p>Weight: {data.weight / 10} Kg</p>

                <div>
                    <p>Types:</p>
                    {data.types.map((type) => {
                        return (
                            <div>
                                <p>{type.type.name}</p>
                            </div>
                        )
                    })}
                </div>

                <div>
                    <p>Abilities:</p>
                    {data.abilities.map((ability) => {
                        const displayAbility = ability.ability.name.replace(/-/g, " ");

                        return (
                            <div>
                                <p>{displayAbility}</p>
                                <p>{ability.is_hidden && "(Hidden Ability)"}</p>
                            </div>
                        )
                    })}
                </div>
            </Details>
            <FlavorTextTable>
                {flavorText?.map((entry) => {
                    const displayName = entry.version.name.replace(/-/g, " ");

                    return (
                        <div>
                            <GameTitle>{displayName}</GameTitle>
                            <p>{entry.flavor_text}</p>
                        </div>
                    )
                })}
            </FlavorTextTable>
        </Container>
    )
}

export default Display;