import {
  Card,
  CardContent,
} from "@/components/ui/card";
import React from "react";

interface NoFoundDataProps {
  text: string;
}

const NoFoundData: React.FC<NoFoundDataProps> = ({ text }) => {
  return (
    <div className='mt-[5vh] flex items-center justify-center'>
      <Card className='min-w-[200px] max-w-[520px] border-border bg-card shadow-none'>
        <CardContent>
          <h2 className='font-serif text-2xl text-muted-foreground'>{text}</h2>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoFoundData;
