"use client"

import type { Monster } from "@/types/game";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { handleLootAttempt } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Slider } from "../ui/slider";
import type { LootAttemptInput, LootAttemptOutput } from "@/ai/flows/loot-attempt-ai";

type Props = {
    npc: Monster
}

export default function LootAttemptClient({ npc }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<LootAttemptOutput | null>(null);
    const [npcParams, setNpcParams] = useState({
        greed: npc.greed,
        power: npc.power,
        relationship: -50, // Default hostile
        otherPlayers: 0,
    });

    const onAttempt = async () => {
        setIsLoading(true);
        setResult(null);
        const input: LootAttemptInput = {
            npcGreed: npcParams.greed,
            npcPowerRelative: npcParams.power,
            npcRelationshipToPlayer: npcParams.relationship,
            otherPlayersNearby: npcParams.otherPlayers,
        };
        const aiResult = await handleLootAttempt(input);
        setResult(aiResult);
        setIsLoading(false);
    }
    
    return (
        <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">The defeated {npc.name} seems to be considering its options...</p>
            
            <div className="space-y-2">
                <div>
                    <label className="text-xs">NPC Greed: {npcParams.greed}</label>
                    <Slider value={[npcParams.greed]} onValueChange={([v]) => setNpcParams(p => ({...p, greed: v}))} max={100} step={1} />
                </div>
                <div>
                    <label className="text-xs">NPC Relative Power: {npcParams.power}</label>
                    <Slider value={[npcParams.power]} onValueChange={([v]) => setNpcParams(p => ({...p, power: v}))} min={-100} max={100} step={1} />
                </div>
            </div>
            
            <Button onClick={onAttempt} disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                What happens next?
            </Button>
            
            {result && (
                <Card className={`mt-4 ${result.attemptSteal ? 'border-destructive' : 'border-green-500'}`}>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base">{result.attemptSteal ? 'It attacks for your loot!' : 'It backs down.'}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <p className="text-xs text-muted-foreground">{result.reasoning}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
