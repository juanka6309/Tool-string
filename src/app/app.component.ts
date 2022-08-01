import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ToastMessage } from './toast-Message';

export interface IEquipmentsImage {
  id: number;
  description: string;
  svgName: string;
  elements: Array<IEquipmentsElements>;
}

export interface IEquipmentsElements {
  id: number;
  description: string;
  svgName: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  listEquipments = [
    {
      id: 1,
      description: 'Pathfinder',
      svgName: 'svg-pathfinder',
      elements: [],
    },
    {
      id: 2,
      description: 'CP-12',
      svgName: 'svg-cp12',
      x: 0,
      y: 0,
      elements: [],
    },
    {
      id: 3,
      description: 'TTB-505',
      svgName: 'svg-TTB-505',
      x: 0,
      y: 0,
      elements: [],
    },
  ];
  listImagesEquipmentsPivot: Array<IEquipmentsImage> = [
    {
      id: 1,
      description: 'Pathfinder_SBJ_v1',
      svgName: 'svg-pathfinder',
      elements: [
        {
          id: 1,
          description: 'CP-12',
          svgName: 'svg-cp12',
          x: 0,
          y: 85,
        },
        {
          id: 2,
          description: 'TTB-505',
          svgName: 'svg-TTB-505',
          x: 0,
          y: 33,
        },
      ],
    },
  ];

  listImagesEquipments: Array<IEquipmentsImage> = [];

  options: any = {
    group: {
      name: 'test',
      pull: 'clone',
    },
    handle: '.handle',
  };
  options2: any = {
    group: {
      name: 'test2',
      pull: 'clone',
    },
  };
  /**
   *
   */
  constructor(private _toastMessage: ToastMessage) {}

  ngOnInit(): void {
    let data = localStorage.getItem('__DATA_TOOL_STRING__');
    if (data) {
      this.listImagesEquipments = JSON.parse(data);
    }
  }

  stopPropagation(event: any) {}

  zIndexSerial: number = 1000;
  onDragStarted(event: any): void {
    event.source.element.nativeElement.style.zIndex = this.zIndexSerial + '';
    this.zIndexSerial = this.zIndexSerial + 1;
    console.log('onDragStarted', event);
  }

  cdkDragDropped(event: any) {
    console.log('cdkDragDropped', event);
  }

  /**
   *
   * @param event Se emite cuando el usuario deja de arrastrar un elemento en el contenedor
   */
  cdkDragEnded(event: any, Parent: IEquipmentsImage, idChild: number) {
    let position = event.source.getFreeDragPosition();
    let isvalid = true;
    Parent.elements.forEach((item) => {
      let start = item.y - 20;
      let end = item.y + 20;
      console.log(item, `***********${start}----${position.y}-----${end} `);
      if (position.y > start && position.y < end && item.id !== idChild) {
        this._toastMessage.error('no se puede posisionar en el mismo lugar');
        isvalid = false;
      }
    });

    if (isvalid) {
      this.registerTool(Parent.id, idChild, position);
    } else {
      event.source._dragRef.reset();
      // let result = this.getPositionChild(Parent.elements, idChild);
      // event.source.element.nativeElement.style.transform = 'none';
      // const source: any = event.source;
      // this.listImagesEquipments.forEach((item) => {
      //   if (item.id === Parent.id) {
      //     item.elements.forEach((element) => {
      //       if (element.id === idChild) {
      //         element.x = 0;
      //         element.y = result ? result.y : 0;
      //         source._activeTransform = { x: 0, y: result ? result.y : 0 };

      //         source._passiveTransform = { x: 0, y: result ? result.y : 0 };
              
      //       }
      //     });
      //   }
      // });
    }
  }

  getPositionChild(data: Array<IEquipmentsElements>, id: number) {
    let result;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        result = data[i];
      }
    }
    return result;
  }

  registerTool(idParent: number, idChild: number, position: any) {
    this.listImagesEquipments.forEach((item) => {
      if (item.id === idParent) {
        item.elements.forEach((element) => {
          if (element.id === idChild) {
            element.x = position.x;
            element.y = position.y;
          }
        });
      }
    });
    localStorage.clear();
    localStorage.setItem(
      '__DATA_TOOL_STRING__',
      JSON.stringify(this.listImagesEquipments)
    );
    this._toastMessage.success('Se registro correctamente el tool string');
  }

  cdkDropListDropped(event: any) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
