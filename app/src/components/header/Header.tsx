import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

type Props = {
  organizationName?: string;
  isCentered?: boolean;
};

const Header = ({ organizationName, isCentered }: Props) => {
  const rootStyles = [styles.root];
  if (isCentered) {
    rootStyles.push(styles.isCentered)
  }
  return (
    <div className={rootStyles.join(' ')}>
      <h1 className={styles.brand}>
        <Link to="/">Medical data</Link>
      </h1>
      {organizationName && (
        <p className={styles.organizationName}>{organizationName}</p>
      )}
    </div>
  );
};

export default Header;
