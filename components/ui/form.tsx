'use client';

import * as React from 'react';
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => (
    <FormFieldContext.Provider value={{ name: props.name }}>
        <Controller {...props} />
    </FormFieldContext.Provider>
);

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
);

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext.name) {
        throw new Error('useFormField must be used inside <FormField>');
    }

    return {
        id: itemContext.id,
        name: fieldContext.name,
        formItemId: `${itemContext.id}-item`,
        formMessageId: `${itemContext.id}-message`,
        ...fieldState,
    };
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const id = React.useId();
        return (
            <FormItemContext.Provider value={{ id }}>
                <div ref={ref} className={cn('flex flex-col', className)} {...props} />
            </FormItemContext.Provider>
        );
    }
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();
    return (
        <label
            ref={ref}
            htmlFor={formItemId}
            className={cn('form-label', error && 'text-red-500', className)}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message) : children;
    if (!body) return null;
    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn('mt-1.5 text-sm font-medium text-red-500', className)}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormItem, FormLabel, FormMessage, useFormField };
