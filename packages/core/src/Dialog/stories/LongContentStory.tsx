/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useState } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
} from "@hitachivantara/uikit-react-core";

export const LongContentStory = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <HvButton style={{ width: "120px" }} onClick={() => setOpen(true)}>
        Open dialog
      </HvButton>
      <HvDialog disableBackdropClick open={open} onClose={() => setOpen(false)}>
        <HvDialogTitle>Terms and Conditions</HvDialogTitle>
        <HvDialogContent indentContent tabIndex={0} role="region">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut sem
          mattis, finibus tellus et, fringilla erat. Nulla justo lacus, pharetra
          at fringilla eget, interdum sit amet mauris. Pellentesque metus ex,
          gravida quis sem ac, placerat gravida libero. Praesent eu eros nec
          risus auctor blandit ac non sapien. Aliquam consequat pellentesque
          vulputate. Sed auctor, justo vel sagittis gravida, diam eros pharetra
          eros, interdum vestibulum tortor magna in dolor.
          <br />
          <br />
          Fusce eget ligula placerat, condimentum dolor non, placerat nunc. In
          mollis massa elit, id vestibulum turpis lobortis vel. Praesent eget
          consequat lorem. Nunc aliquam justo dapibus nisl ultrices, at varius
          lacus laoreet. Aliquam libero velit, pretium ut odio ultrices, viverra
          laoreet erat. Vivamus neque justo, venenatis non diam placerat,
          pellentesque ultricies mi. Nunc ullamcorper lorem id libero laoreet,
          vulputate dignissim felis malesuada. Curabitur blandit odio a nibh
          faucibus porttitor. Maecenas placerat vulputate purus, sed tempor nunc
          scelerisque in. Praesent rhoncus tempor turpis, nec vehicula nulla
          laoreet vel.
          <br />
          <br />
          Q uisque nec eros lacus. Aenean pharetra interdum justo, in commodo
          sem porta non. Nam non lorem ultricies, suscipit ante ut, dictum
          lacus. Duis pharetra orci sem, sit amet porta orci pulvinar vel.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Nunc tortor ligula, sollicitudin id augue ac,
          maximus porttitor ante. Etiam ultricies dolor in pretium scelerisque.
          Integer sed lectus eget lectus mollis elementum. Ut feugiat magna ac
          venenatis aliquet. Nulla ut justo nulla. Class aptent taciti sociosqu
          ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean
          sollicitudin sodales dictum. Aenean vehicula magna venenatis mollis
          suscipit. Aliquam gravida orci a lacinia convallis. Nunc dignissim
          eros vel mi hendrerit, ac euismod quam vehicula. Proin sodales eget
          est finibus aliquam. Maecenas in felis purus. Vestibulum dictum ex
          elit, at mollis nibh tempor quis. Curabitur velit elit, scelerisque at
          varius eget, porta nec dui. Sed efficitur augue laoreet, feugiat orci
          a, pellentesque quam. Proin enim turpis, scelerisque eget enim non,
          euismod semper magna.
          <br />
          <br />
          Nam aliquam, turpis vitae pulvinar feugiat, enim turpis tincidunt
          enim, quis pharetra nibh massa vitae enim. Etiam in tincidunt nisl,
          nec semper metus. Donec dignissim dolor non nulla fermentum, laoreet
          mollis nulla tempor. Suspendisse et leo aliquam, aliquet lacus at,
          viverra ante. Fusce vehicula sit amet est id pulvinar. Donec eu ornare
          erat. Nulla urna libero, cursus ornare ullamcorper eget, pellentesque
          malesuada lectus. Aliquam sed ipsum nec tortor auctor pharetra
          scelerisque id nulla. Duis tempus scelerisque erat, non finibus lacus
          fermentum quis. Proin sodales ultricies nisl eget tristique. Donec at
          urna vel lectus pellentesque tristique quis bibendum eros.
          <br />
          <br />
          Aliquam erat volutpat. Suspendisse semper fringilla accumsan.
          Suspendisse vel fringilla nisi, a interdum tortor. Praesent ac tellus
          non nunc viverra vulputate. Donec semper urna nibh, nec sagittis
          turpis semper vitae. Praesent varius lacinia dui id tincidunt. Donec
          lobortis non diam in varius. Aliquam dictum felis odio, dictum
          porttitor est cursus vel. In mi elit, mattis et tincidunt quis,
          volutpat cursus ipsum. Suspendisse mollis massa ipsum. Curabitur diam
          sapien, pellentesque eget arcu vitae, accumsan consequat justo.
          Vestibulum vel orci non risus auctor volutpat. Mauris imperdiet
          fermentum venenatis. Integer purus est, placerat vel fermentum a,
          semper vel urna. Nulla risus nisl, condimentum eleifend porttitor at,
          imperdiet vel turpis. Suspendisse potenti. Praesent vitae lacus non
          lectus aliquet semper a id nunc. Aliquam ut commodo felis. Sed
          dignissim mauris ligula, eu volutpat sem commodo ut. Proin lacus diam,
          dapibus at eros nec, luctus dictum libero. Vivamus congue odio ex,
          facilisis tincidunt tortor tincidunt vitae. Nullam nec ornare sem. Ut
          cursus gravida dictum. Phasellus dapibus venenatis mi et dapibus.
        </HvDialogContent>
        <HvDialogActions>
          <HvButton
            autoFocus
            variant="secondaryGhost"
            onClick={() => setOpen(false)}
          >
            I Accept
          </HvButton>
        </HvDialogActions>
      </HvDialog>
    </div>
  );
};
