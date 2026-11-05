import * as React from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPopup,
    DialogPortal,
    DialogTitle,
} from "./dialog";

function SecondDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogBackdrop />
                <DialogPopup>
                    <DialogTitle>Second</DialogTitle>
                </DialogPopup>
            </DialogPortal>
        </Dialog>
    );
}

export function NestedDialogs() {
    const [firstOpen, setFirstOpen] = React.useState(false);
    const [secondOpen, setSecondOpen] = React.useState(false);
    return (
        <>
            <button onClick={() => setFirstOpen(true)}>Open first</button>
            <Dialog open={firstOpen} onOpenChange={setFirstOpen}>
                <DialogPortal>
                    <DialogBackdrop />
                    <DialogPopup>
                        <DialogTitle>First</DialogTitle>
                        <button onClick={() => setSecondOpen(true)}>
                            Open second
                        </button>
                        {secondOpen && (
                            <SecondDialog
                                open={secondOpen}
                                onOpenChange={setSecondOpen}
                            />
                        )}
                    </DialogPopup>
                </DialogPortal>
            </Dialog>
        </>
    );
}
