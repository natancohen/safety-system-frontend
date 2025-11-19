import Form from '../../form/main_form';
import styles from './form_page.module.css';

export default function FormPage() {
  return (
    <div className={styles.pageContainer} dir="rtl">
      <Form />
    </div>
  );
}