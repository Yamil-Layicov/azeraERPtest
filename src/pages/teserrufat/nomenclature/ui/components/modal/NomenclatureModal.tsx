import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/shared/ui/modal/base';
import { FormInput } from '@/shared/ui/input';
import { Button } from '@/shared/ui';
import styles from './NomenclatureModal.module.css';

interface NomenclatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  parentName?: string;
  title: string;
  initialData?: any;
  mode: 'add' | 'edit';
}

interface FormValues {
  nodeType: 'category' | 'product' | null;
  name: string;
  barcode?: string;
  printName?: string;
  article?: string;
  unit?: string;
  type?: string;
  vatRate?: number;
}

export const NomenclatureModal: React.FC<NomenclatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentName,
  title,
  initialData,
  mode
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>();

  const nodeType = watch('nodeType');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        reset(initialData);
      } else {
        reset({
          nodeType: null,
          name: '',
          barcode: '',
          printName: '',
          article: '',
          unit: 'ədəd',
          type: 'Mal',
          vatRate: 18
        });
      }
    }
  }, [isOpen, mode, initialData, reset]);

  const onSubmit = (data: FormValues) => {
    onSave(data);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size={nodeType === 'product' ? 'md' : 'sm'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {parentName && mode === 'add' && (
          <div className={styles.parentInfo}>
            <span>Valideyn: </span>
            <strong>{parentName}</strong>
          </div>
        )}

        {mode === 'add' && (
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeBtn} ${nodeType === 'category' ? styles.active : ''}`}
              onClick={() => setValue('nodeType', 'category')}
            >
              Alt Kateqoriya
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${nodeType === 'product' ? styles.active : ''}`}
              onClick={() => setValue('nodeType', 'product')}
            >
              Məhsul
            </button>
          </div>
        )}
        
        {nodeType && (
          <>
            <div className={nodeType === 'product' ? styles.gridForm : styles.singleForm}>
              <FormInput
                label="Ad"
                id="name"
                placeholder="Nomenklatura adını daxil edin"
                register={register('name', { required: 'Ad mütləqdir' })}
                error={errors.name?.message}
                required
                type='text'
              />

              {nodeType === 'product' && (
                <>
                  <FormInput
                    label="Barkod"
                    id="barcode"
                    placeholder="Barkod daxil edin"
                    register={register('barcode')}
                    type='text'
                  />
                  <FormInput
                    label="Çap adı"
                    id="printName"
                    placeholder="Çap adını daxil edin"
                    register={register('printName')}
                    type='text'
                  />
                  <FormInput
                    label="Artikul"
                    id="article"
                    placeholder="Artikul daxil edin"
                    register={register('article')}
                    type='text'
                  />
                  <FormInput
                    label="Ölçü vahidi"
                    id="unit"
                    placeholder="ədəd, kq və s."
                    register={register('unit')}
                    type='text'
                  />
                  <FormInput
                    label="Növ"
                    id="type"
                    placeholder="Mal, Xidmət və s."
                    register={register('type')}
                    type='text'
                  />
                  <FormInput
                    label="ƏDV dərəcəsi (%)"
                    id="vatRate"
                    placeholder="18"
                    register={register('vatRate', { valueAsNumber: true })}
                    type='number'
                  />
                </>
              )}
            </div>

            <div className={styles.footer}>
              <Button variant="secondary" onClick={onClose} type="button">
                Ləğv et
              </Button>
              <Button variant="primary" type="submit">
                Yadda saxla
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};
