import {NavLink, useLocation} from "react-router-dom";
import styled from "styled-components";
import {animated, useSpring, config} from "react-spring";
import usePrevious from "../../hooks/usePrevious";

const Navigation = styled.nav`
  margin: 0 auto;
  width: fit-content;
  display: flex;
  justify-content: space-around;
  text-align: center;
  align-items: center;
  padding: 10px 0;
  position: relative;
  z-index: 1
`;

const MenuItem = styled(NavLink)`
    min-width: 200px;
    z-index: 3
`;

const SpringTab = styled(animated.div)`
  background-color: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius};
  position: absolute;
  left: 0;
  width: calc(100% / ${props => props.tabs});
  height: 100%;
  pointer-events: none;
`;

const paths = [
    {
        name: "Pokemon",
        to: "/pokemon"
    },
    {
        name: "Items",
        to: "/item"
    }
];

const Menu = () => {
    const location = useLocation();
    const index = paths.findIndex((path) => location.pathname === path.to);
    const prevIndex = usePrevious(index);

    const styles = useSpring({
        config: config.wobbly,
        from: {translateX: (100 * prevIndex) + '%'},
        to: {translateX: (100 * index) + '%'}
    })

    return (
        <Navigation>
            <SpringTab style={styles} tabs={2} />
            {paths.map((path) => {
                return <MenuItem to={path.to}>{path.name}</MenuItem>
            })}
        </Navigation>
    )
}

export default Menu;