import { useState, useEffect } from "react";
import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import Specialities from "./itemMenuCreator/specialties";
import Soups from "./itemMenuCreator/soup";
import Beginnings from "./itemMenuCreator/beginning";
import Meats from "./itemMenuCreator/meat";
import Drinks from "./itemMenuCreator/drinks";
import ManageSoftDrinks from "./ManageSoftDrinks";

function MenuCreator(props) {
  const { btnCreateMenuAvalaible} = props
  const [menuSection, setMenuSection] = useState(0);
  const [seeMEnuOption, setSeeMenuOption] = useState();
  const [childrenUpdate, setChildrenUpdate] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  /*Función que define si debe ir adelante el menú o atrás*/
  const viewSectionMenu = (backOrForward) => {
    if (backOrForward) {
      let suma = menuSection + 1;
      setMenuSection(suma);
      switchMenu(suma);
    } else {
      let resta = menuSection - 1;
      setMenuSection(resta);
      switchMenu(resta);
    }
  };

  /*Este es el switch menú, el cuál muestra un elemento del menú de acuerdo a la variable que recibe como parámetro*/
  const switchMenu = (operador) => {
    switch (operador) {
      case 1:
        setSeeMenuOption(
          <Specialities
            setChangeFather={props.setChange}
            setChildrenUpdate={setChildrenUpdate}
            viewSectionMenu={viewSectionMenu}
          />
        );
        break;
      case 2:
        setSeeMenuOption(<Soups setChangeFather={props.setChange} />);
        break;
      case 3:
        setSeeMenuOption(<Beginnings setChangeFather={props.setChange} />);
        break;
      case 4:
        setSeeMenuOption(<Meats setChangeFather={props.setChange} />);
        break;
      case 5:
        setSeeMenuOption(<Drinks setChangeFather={props.setChange} />);
        break;
      default:
        setMenuSection(0);
        setSeeMenuOption(<></>);
        break;
    }
  };

  /*Esta función sirve para actualizar la vista del menú solo en el primer caso
  del switchCase ya que este tiene una condición adicional*/
  useEffect(() => {
    if (childrenUpdate) {
      viewSectionMenu();
      setChildrenUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenUpdate]);


  const createMenuPrevious=()=>{
    props.createMenu();
  }
  return (
    <>
      <div
        className={
          "menuCreator " +
          (props.menuTemp.length !== 0 ? "menuCreator70" : "menuCreator100")
        }
      >
        {menuSection === 0 && <h4>¿Que deseas realizar?</h4>}
        {seeMEnuOption}
        <div className="buttomsContainer" >
          {menuSection === 0 ? (
            <></>
          ) : (
            <Button
              color="warning"
              onClick={() => {
                viewSectionMenu(false);
              }}
            >
              Atrás
            </Button>
          )}
          {menuSection >= 5 ? (
            <>
              <Button
                color={btnCreateMenuAvalaible? "success" : "default"}
                onClick={() => {
                  btnCreateMenuAvalaible && createMenuPrevious()
                }}
              >
                {btnCreateMenuAvalaible? "Crear Menú" : "Creando..."}
              </Button>
            </>
          ) : (
            <>
              <Button
                color="primary"
                onClick={() => {
                  viewSectionMenu(true);
                }}
              >
                {menuSection === 0 ? "Crear Menú del día" : "Siguiente"}
              </Button>
              {menuSection === 0 && <Button onClick={onOpen}>Administrar Gaseosas</Button>}
            </>
          )}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior={"inside"}
          size="xl"
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            }
          }}
        >
          <ModalContent className="modal_content_edit_menu">
            {<ManageSoftDrinks
                closeModalEdit={onOpenChange}
            />}
          </ModalContent>
        </Modal>
        </div>
      </div>
    </>
  );
}

export default MenuCreator;
