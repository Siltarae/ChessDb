import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) => (
  <AlertDialogPrimitive.Overlay
    data-slot="alert-dialog-overlay"
    className={cn('fixed inset-0 z-50 bg-black/50', className)}
    {...props}
  />
);

const AlertDialogContent = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      data-slot="alert-dialog-content"
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-5 text-foreground shadow-lg',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
);

const AlertDialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div data-slot="alert-dialog-header" className={cn('grid gap-2', className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
);

const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => (
  <AlertDialogPrimitive.Title
    data-slot="alert-dialog-title"
    className={cn('text-base font-semibold', className)}
    {...props}
  />
);

const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => (
  <AlertDialogPrimitive.Description
    data-slot="alert-dialog-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);

const AlertDialogAction = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) => (
  <AlertDialogPrimitive.Action asChild>
    <Button className={className} {...props} />
  </AlertDialogPrimitive.Action>
);

const AlertDialogCancel = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button variant="outline" className={className} {...props} />
  </AlertDialogPrimitive.Cancel>
);

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
