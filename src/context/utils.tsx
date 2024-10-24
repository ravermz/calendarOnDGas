import React, { ComponentProps, FC } from 'react'

interface IProps {
  children: React.JSX.Element
}

/**
 * Función para combinar múltiples store providers en uno solo
 *
 * @param {...FC<IProps>[]} components - Lista de store providers a combinar
 * @returns {FC<IProps>} Un nuevo componente que envuelve los store providers
 *
 * @example
 * const CombinedComponent = combineComponents(ComponentA, ComponentB, ComponentC)
 * // Uso en JSX
 * <CombinedComponent>
 *   <App />
 * </CombinedComponent>
 */
const combineComponents = (...components: FC<IProps>[]): FC<IProps> =>
  components.reduce(
    (AccumulatedComponents, CurrentComponent): FC<IProps> =>
      ({ children }: ComponentProps<FC<IProps>>): JSX.Element =>
        (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        ),
    ({ children }) => <>{children}</>,
  )

/**
 * Tipo genérico para mapear acciones en un reducer
 *
 * @typedef {Object} TActionMap
 * @template M - Un objeto que representa el mapa de acciones
 * @property {Key} type - Tipo de la acción, basado en las claves de M
 * @property {M[Key]} [payload] - Payload de la acción, basado en el tipo asociado a la clave en M
 */
type TActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export { combineComponents }
export type { TActionMap }
