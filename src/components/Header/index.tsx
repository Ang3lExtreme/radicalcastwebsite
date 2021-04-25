import styles from './styles.module.scss'
import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'
export function Header(){
  const currentDate = format(new Date(), 'EEEEEE, d, MMMM', {locale: ptBr});

  return(
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>Conversa entre amigos sobre diversos assuntos</p>
      <span> {currentDate}</span>
    </header>
    
   
  );

}
  
