import Form from '../../components/Form/Form';
import styles from './FormPage.module.css';

export default function FormPage() {
  return (
    <div className={styles.pageContainer} dir="rtl">
      <Form />
    </div>
  );
}