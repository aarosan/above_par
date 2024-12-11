import styled from 'styled-components';
import hexToRgba from '../utils/hexToRgba';

const CourseButton = styled.button`
    border-radius: 25px;
    border: 2px solid ${({ color }) => color.light};
    background-color: transparent;
    padding: 10px 25px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.7);
    
    &:hover {
        border: 2px solid ${({ color }) => color.dark};
        background-color: ${({ color }) => color.dark};
        color: white;
        cursor: pointer;
    }

    &:active {
        border: 2px solid ${({ color }) => color.light};
        background-color: ${({ color }) => hexToRgba(color.dark, 0.3)};
        color: rgba(0, 0, 0, 0.7);
        cursor: pointer;
    }
`;

export default CourseButton;