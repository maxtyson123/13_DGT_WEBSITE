import {Mathdle} from "mathdle";

export default function Page(){

    return (
        <div style={
            {
                width: '100vw',
                height: '100%',
                display: 'grid',
                alignItems: 'center',
                justifyItems: 'center',
                color: 'black',
                fontFamily: 'Arial, sans-serif',
            }
        }>
            <Mathdle />
        </div>
    );
};

