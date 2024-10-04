import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterInvoiceService } from '../../../../@core/services/register-invoice.service';
import { HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RegisterInvoiceForm } from '../../../../@core/models/forms/register-invoice-form.model';
import { SharedServiceService } from '../../../../@core/services/shared-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { InvoceFormService } from '../../../../@core/services/invoce-form.service';
import { DocumentoElectronicoForm } from '../../../../@core/models/forms/invoice-thefactory-form.model';
import { TheFactoryService } from '../../../../@core/services/the-factory.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {
  isLoading = signal(false); // Definir la señal de carga

  formattedTotalBs: number = 0; // Cambiado a number
  selectedOption: string = ''; // Valor inicial vacío
  referenceNumber: string = '';
  phoneNumber: string = '';
  idNumber: string = '';
  batchNumber: string = '';
  descrip: string = '';

  paymentsList: { monto: number, igtf: number, tipoPago: string, montoDolares?: number }[] = [];

  totalBs: number;
  totalUsd: number;
  cxcItems: any[] = [];
  itemFactItems: any[] = [];

  paymentForm: FormGroup;

  registerForm: FormGroup<RegisterInvoiceForm>;
  documentoElectronicoForm: FormGroup<DocumentoElectronicoForm>;
  http: any;

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private registerInvoiceService: RegisterInvoiceService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private dialogRef: DynamicDialogRef,
    private cd: ChangeDetectorRef,
    private invoiceFormService: InvoceFormService,
    private theFactoryService: TheFactoryService
  ) {
    this.totalBs = this.dialogConfig.data.totalBs.toFixed(2);
    this.totalUsd = this.dialogConfig.data.totalUsd.toFixed(2);
  }

  ngOnInit(): void {

    this.formattedTotalBs = null;
    //this.formattedTotalBs = this.totalBs; // Inicializa formattedTotalBs con totalBs
    this.updateDropdownOptions(this.selectedOption); // Inicializa las opciones de dropdown

    // Inicializa el formulario vacío
    this.documentoElectronicoForm = this.createDocumentoElectronicoForm({
      documentoElectronico: {
        encabezado: {
          identificacionDocumento: {
            tipoDocumento: '',
            numeroDocumento: '',
            tipoProveedor: null,
            tipoTransaccion: '',
            numeroPlanillaImportacion: null,
            numeroExpedienteImportacion: null,
            serieFacturaAfectada: null,
            numeroFacturaAfectada: null,
            fechaFacturaAfectada: null,
            montoFacturaAfectada: null,
            comentarioFacturaAfectada: null,
            regimenEspTributacion: null,
            fechaEmision: '',
            fechaVencimiento: '',
            horaEmision: '',
            anulado: false,
            tipoDePago: '',
            serie: '',
            sucursal: '',
            tipoDeVenta: '',
            moneda: ''
          },
          vendedor: {
            codigo: '',
            nombre: '',
            numCajero: ''
          },
          comprador: {
            tipoIdentificacion: '',
            numeroIdentificacion: '',
            razonSocial: '',
            direccion: '',
            pais: '',
            telefono: [''],
            correo: ['']
          },
          sujetoRetenido: null,
          totales: {
            nroItems: '',
            montoGravadoTotal: '',
            montoExentoTotal: null,
            subtotal: '',
            totalAPagar: '',
            totalIVA: '',
            montoTotalConIVA: '',
            montoEnLetras: '',
            totalDescuento: null,
            listaDescBonificacion: [
              {
                descDescuento: '',
                montoDescuento: ''
              }
            ],
            impuestosSubtotal: [
              {
                codigoTotalImp: '',
                alicuotaImp: '',
                baseImponibleImp: '',
                valorTotalImp: ''
              }
            ],
            formasPago: [
              {
                descripcion: '',
                fecha: '',
                forma: '',
                monto: '',
                moneda: '',
                tipoCambio: null
              }
            ]
          },
          totalesRetencion: null
        },
        detallesItems: [
          {
            numeroLinea: '',
            codigoCIIU: null,
            codigoPLU: '',
            indicadorBienoServicio: '',
            descripcion: '',
            cantidad: '',
            unidadMedida: '',
            precioUnitario: '',
            precioUnitarioDescuento: null,
            montoBonificacion: null,
            descripcionBonificacion: null,
            descuentoMonto: null,
            precioItem: '',
            codigoImpuesto: '',
            tasaIVA: '',
            valorIVA: '',
            valorTotalItem: '',
            infoAdicionalItem: null,
            listaItemOTI: [
              {
                tasaOTI: '',
                codigoOTI: '',
                valorOTI: ''
              }
            ]
          }
        ],
        detallesRetencion: null,
        viajes: null,
        infoAdicional: [
          {
            campo: '',
            valor: ''
          }
        ],
        guiaDespacho: null
      }
    });
  

    // Inicializa el formulario vacío
    this.registerForm = this.registerInvoiceService.createRegisterFormInvoice({
      codClie: '',
      codVend: '',
      codUbic: '',
      descrip: '',
      direc1: '',
      direc2: '',
      mtoTotal: 0,
      tgravable: 0,
      texento: 0,
      monto: 0,
      mtoTax: 0,
      contado: 0,
      tipoCli: 0,
      fechaE: '',
      fechaV: '',
      Id3: '',
      ordenC: '',
      telef: '',
      tipoFac: '',
      items: [
        {
          codItem: '',
          codUbic: '',
          codVend: '',
          descrip1: '',
          priceO: 0,
          precio: 0,
          cantidad: 0,
          mtoTax: 0,
        },
      ],
      payments: [
        {
          monto: 0,
          codTarj: '',
          fechae: '',
          descrip: '',
        },
      ],
      taxes: [
        {
          monto: 0,
          codTaxs: '',
          tgravable: 0,
        },
      ],
    });

    // Suscribirse al cliente seleccionado
    this.sharedService.selectedCustomer$.subscribe((customer) => {
      if (customer) {
        console.log('Cliente recibido en suscripción:', customer); // Verifica los
        this.updateForm(customer);
      }
    });

        // Agregar items del localStorage al formulario
        this.addItemsFromLocalStorage();
  }

  createDocumentoElectronicoForm(values: any): FormGroup<DocumentoElectronicoForm> {
    return this.fb.group({
      documentoElectronico: this.fb.group({
        encabezado: this.fb.group({
          identificacionDocumento: this.fb.group({
            tipoDocumento: new FormControl(values.tipoDocumento),
            numeroDocumento: new FormControl(values.numeroDocumento),
            tipoProveedor: new FormControl(values.tipoProveedor),
            tipoTransaccion: new FormControl(values.tipoTransaccion),
            numeroPlanillaImportacion: new FormControl(values.numeroPlanillaImportacion),
            numeroExpedienteImportacion: new FormControl(values.numeroExpedienteImportacion),
            serieFacturaAfectada: new FormControl(values.serieFacturaAfectada),
            numeroFacturaAfectada: new FormControl(values.numeroFacturaAfectada),
            fechaFacturaAfectada: new FormControl(values.fechaFacturaAfectada),
            montoFacturaAfectada: new FormControl(values.montoFacturaAfectada),
            comentarioFacturaAfectada: new FormControl(values.comentarioFacturaAfectada),
            regimenEspTributacion: new FormControl(values.regimenEspTributacion),
            fechaEmision: new FormControl(values.fechaEmision),
            fechaVencimiento: new FormControl(values.fechaVencimiento),
            horaEmision: new FormControl(values.horaEmision),
            anulado: new FormControl(values.anulado),
            tipoDePago: new FormControl(values.tipoDePago),
            serie: new FormControl(values.serie),
            sucursal: new FormControl(values.sucursal),
            tipoDeVenta: new FormControl(values.tipoDeVenta),
            moneda: new FormControl(values.moneda)
          }),
          vendedor: this.fb.group({
            codigo: new FormControl(values.codigo),
            nombre: new FormControl(values.nombre),
            numCajero: new FormControl(values.numCajero)
          }),
          comprador: this.fb.group({
            tipoIdentificacion: new FormControl(values.tipoIdentificacion),
            numeroIdentificacion: new FormControl(values.numeroIdentificacion),
            razonSocial: new FormControl(values.razonSocial),
            direccion: new FormControl(values.direccion),
            pais: new FormControl(values.pais),
            telefono: this.fb.array(values.telefono.map(t => new FormControl(t))),
            correo: this.fb.array(values.correo.map(c => new FormControl(c)))
          }),
          sujetoRetenido: new FormControl(values.sujetoRetenido),
          totales: this.fb.group({
            nroItems: new FormControl(values.nroItems),
            montoGravadoTotal: new FormControl(values.montoGravadoTotal),
            montoExentoTotal: new FormControl(values.montoExentoTotal),
            subtotal: new FormControl(values.subtotal),
            totalAPagar: new FormControl(values.totalAPagar),
            totalIVA: new FormControl(values.totalIVA),
            montoTotalConIVA: new FormControl(values.montoTotalConIVA),
            montoEnLetras: new FormControl(values.montoEnLetras),
            totalDescuento: new FormControl(values.totalDescuento),
            listaDescBonificacion: this.fb.array(values.listaDescBonificacion.map(d => this.fb.group({
              descDescuento: new FormControl(d.descDescuento),
              montoDescuento: new FormControl(d.montoDescuento)
            }))),
            impuestosSubtotal: this.fb.array(values.impuestosSubtotal.map(i => this.fb.group({
              codigoTotalImp: new FormControl(i.codigoTotalImp),
              alicuotaImp: new FormControl(i.alicuotaImp),
              baseImponibleImp: new FormControl(i.baseImponibleImp),
              valorTotalImp: new FormControl(i.valorTotalImp)
            }))),
            formasPago: this.fb.array(values.formasPago.map(f => this.fb.group({
              descripcion: new FormControl(f.descripcion),
              fecha: new FormControl(f.fecha),
              forma: new FormControl(f.forma),
              monto: new FormControl(f.monto),
              moneda: new FormControl(f.moneda),
              tipoCambio: new FormControl(f.tipoCambio)
            })))
          }),
          totalesRetencion: new FormControl(values.totalesRetencion)
        }),
        detallesItems: this.fb.array(values.detallesItems.map(d => this.fb.group({
          numeroLinea: new FormControl(d.numeroLinea),
          codigoCIIU: new FormControl(d.codigoCIIU),
          codigoPLU: new FormControl(d.codigoPLU),
          indicadorBienoServicio: new FormControl(d.indicadorBienoServicio),
          descripcion: new FormControl(d.descripcion),
          cantidad: new FormControl(d.cantidad),
          unidadMedida: new FormControl(d.unidadMedida),
          precioUnitario: new FormControl(d.precioUnitario),
          precioUnitarioDescuento: new FormControl(d.precioUnitarioDescuento),
          montoBonificacion: new FormControl(d.montoBonificacion),
          descripcionBonificacion: new FormControl(d.descripcionBonificacion),
          descuentoMonto: new FormControl(d.descuentoMonto),
          precioItem: new FormControl(d.precioItem),
          codigoImpuesto: new FormControl(d.codigoImpuesto),
          tasaIVA: new FormControl(d.tasaIVA),
          valorIVA: new FormControl(d.valorIVA),
          valorTotalItem: new FormControl(d.valorTotalItem),
          infoAdicionalItem: new FormControl(d.infoAdicionalItem),
          listaItemOTI: this.fb.array(d.listaItemOTI.map(i => this.fb.group({
            tasaOTI: new FormControl(i.tasaOTI),
            codigoOTI: new FormControl(i.codigoOTI),
            valorOTI: new FormControl(i.valorOTI)
          })))
        }))),
        detallesRetencion: new FormControl(values.detallesRetencion),
        viajes: new FormControl(values.viajes),
        infoAdicional: this.fb.array(values.infoAdicional.map(i => this.fb.group({
          campo: new FormControl(i.campo),
          valor: new FormControl(i.valor)
        }))),
        guiaDespacho: new FormControl(values.guiaDespacho)
      })
    }) as unknown as FormGroup<DocumentoElectronicoForm>;
  }

  
  updateThfka(customer: any): void {
    const formValues = {
      documentoElectronico: {
        encabezado: {
          identificacionDocumento: {
            tipoDocumento: '01',
            numeroDocumento: '123456',
            tipoProveedor: null,
            tipoTransaccion: '01',
            numeroPlanillaImportacion: null,
            numeroExpedienteImportacion: null,
            serieFacturaAfectada: null,
            numeroFacturaAfectada: null,
            fechaFacturaAfectada: null,
            montoFacturaAfectada: null,
            comentarioFacturaAfectada: null,
            regimenEspTributacion: null,
            fechaEmision: '2024-02-16 12:00:00.000',
            fechaVencimiento: '2024-02-16 12:00:00.000',
            horaEmision: '10:00:00 am',
            anulado: false,
            tipoDePago: '',
            serie: 'B',
            sucursal: '00000',
            tipoDeVenta: 'BS',
            moneda: 'VEF'
          },
          vendedor: null,
          comprador: {
            tipoIdentificacion: 'V',
            numeroIdentificacion: customer.id3 || '',
            razonSocial: customer.descrip || '',
            direccion: customer.direc1 || '',
            ubigeo: null,
            pais: 'VE',
            notificar: null,
            telefono: [customer.telef || ''],
            correo: ['comprador@example.com'],
            otrosEnvios: null
          },
          sujetoRetenido: null,
          totales: {
            nroItems: '10',
            montoGravadoTotal: '100',
            montoExentoTotal: '0',
            subtotal: '100',
            totalAPagar: 116.0,
            totalIVA: 16.0,
            montoTotalConIVA: 116.0,
            montoEnLetras: null,
            totalDescuento: '0.00',
            listaDescBonificacion: [
              {
                descDescuento: '',
                montoDescuento: '0.00'
              }
            ],
            impuestosSubtotal: [
              {
                codigoTotalImp: 'E',
                alicuotaImp: '00.00',
                baseImponibleImp: '000',
                valorTotalImp: '00.00'
              },
              {
                codigoTotalImp: 'IGTF',
                alicuotaImp: '3.00',
                baseImponibleImp: '100.00',
                valorTotalImp: '3.00'
              },
              {
                codigoTotalImp: 'G',
                alicuotaImp: '16.00',
                baseImponibleImp: 100,
                valorTotalImp: 16.0
              }
            ],
            formasPago: [
              {
                descripcion: this.descrip || 'Efectivo',
                fecha: '2024-02-06 12:00:00.000',
                forma: this.selectedOption || '-EFE-',
                monto: this.totalBs,
                moneda: 'VEF',
                tipoCambio: null
              }
            ]
          },
          totalesRetencion: null
        },
        detallesItems: [
          {
            numeroLinea: '1',
            codigoCIIU: 'CIIU',
            codigoPLU: 'PLU123',
            indicadorBienoServicio: 'B',
            descripcion: 'PUNTO SAINT',
            cantidad: '1',
            unidadMedida: 'U',
            precioUnitario: '100.0',
            precioUnitarioDescuento: '0.00',
            montoBonificacion: '0.00',
            descripcionBonificacion: 'N/A',
            descuentoMonto: '0.00',
            precioItem: '100.0',
            codigoImpuesto: 'E',
            tasaIVA: '16',
            valorIVA: '16.0',
            valorTotalItem: '116.0',
            infoAdicionalItem: null,
            listaItemOTI: [
              {
                tasaOTI: '0',
                codigoOTI: 'OTI',
                valorOTI: '0.00'
              }
            ]
          }
        ],
        detallesRetencion: null,
        viajes: null,
        infoAdicional: [
          {
            campo: 'campo1',
            valor: 'valor1'
          }
        ],
        guiaDespacho: null
      }
    };
  
    this.documentoElectronicoForm.setValue(formValues as any);
  
    // Actualiza el array de items en el formulario
    const itemsFormArray = this.documentoElectronicoForm.get('documentoElectronico.detallesItems') as FormArray;
    if (itemsFormArray) {
      itemsFormArray.clear();
      const defaultItems = [
        {
          numeroLinea: '1',
          codigoCIIU: 'CIIU',
          codigoPLU: 'PLU123',
          indicadorBienoServicio: 'B',
          descripcion: 'PUNTO SAINT',
          cantidad: '1',
          unidadMedida: 'U',
          precioUnitario: '100.0',
          precioUnitarioDescuento: '0.00',
          montoBonificacion: '0.00',
          descripcionBonificacion: 'N/A',
          descuentoMonto: '0.00',
          precioItem: '100.0',
          codigoImpuesto: 'E',
          tasaIVA: '16',
          valorIVA: '16.0',
          valorTotalItem: '116.0',
          infoAdicionalItem: null,
          listaItemOTI: [
            {
              tasaOTI: '0',
              codigoOTI: 'OTI',
              valorOTI: '0.00'
            }
          ]
        }
      ];
  
      // Agregar items por defecto
      defaultItems.forEach((item) => itemsFormArray.push(this.fb.group(item)));
  
      console.log('Items actualizados en el formulario:', itemsFormArray.value);
    } else {
      console.error('El control "detallesItems" no es un FormArray');
    }
  }

  generateInvoice(customer: any) {
    this.theFactoryService.updateFormAndGenerateInvoice(customer, this.totalBs, this.selectedOption, this.descrip).subscribe(
      (response) => {
        console.log('Factura generada exitosamente:', response);
      },
      (error) => {
        console.error('Error al generar la factura:', error);
      }
    );
  }

  addItemsFromLocalStorage(): void {
    const items = JSON.parse(localStorage.getItem('invoiceItems') || '[]');
    const mappedItems = items.map((item: any) => this.fb.group({
      codItem: [item.codigo],
      codUbic: ['01'],
      codVend: ['01'],
      descrip1: [item.descripcion],
      priceO: [item.precio],
      precio: [item.precio],
      cantidad: [item.cantidad],
      mtoTax: [item.impuesto]
    }));
  
    // Verifica que el control 'items' sea un FormArray
    const itemsFormArray = this.registerForm.get('items') as FormArray;
    if (itemsFormArray) {
      mappedItems.forEach(item => itemsFormArray.push(item));
    } else {
      console.error('El control "items" no es un FormArray');
    }
    
  }

  updateForm(customer: any): void {
    const formValues = {
      invoice: {
        codClie: customer.id3 || '',
        codVend: '01',
        codUbic: '01',
        descrip: customer.descrip || '',
        direc1: customer.direc1 || '',
        direc2: 'Maracaibo, Venezuela',
        mtoTotal: 116.0,
        tgravable: 100,
        texento: 0,
        monto: 100,
        mtoTax: 16.0,
        contado: 116.0,
        tipoCli: customer.tipocli || 1, // Asigna un valor predeterminado si es null o undefined
        fechaE: '2024-02-16 12:00:00.000',
        fechaV: '2024-02-16 12:00:00.000',
        Id3: customer.id3 || '',
        ordenC: '01',
        telef: customer.telef || '',
        tipoFac: 'A',
      },
      items: [
        {
          codItem: '01',
          codUbic: '01',
          codVend: '01',
          descrip1: 'PUNTO SAINT',
          priceO: 100.0,
          precio: 100.0,
          cantidad: 1,
          mtoTax: 16.0,
        },
      ],
      payments: [
        {
          monto: this.totalBs,
          codTarj: this.selectedOption || '-EFE-',
          fechae: '2024-02-06 12:00:00.000',
          descrip: this.descrip || 'Efectivo',
        },
      ],
      taxes: [
        {
          monto: 16.0,
          codTaxs: 'IVA',
          tgravable: 100.0,
        },
      ],
    };
    
    // Usa setValue para actualizar todos los valores
    this.registerForm.setValue(formValues);
  
    // Actualiza el array de items en el formulario
    const itemsFormArray = this.registerForm.get('items') as FormArray;
    if (itemsFormArray) {
      itemsFormArray.clear();
      const defaultItems = [
        {
          codItem: '01',
          codUbic: '01',
          codVend: '01',
          descrip1: 'PUNTO SAINT',
          priceO: 100.0,
          precio: 100.0,
          cantidad: 1,
          mtoTax: 16.0,
        },
      ];

      // Agregar items por defecto
      defaultItems.forEach((item) => itemsFormArray.push(this.fb.group(item)));

      console.log('Items actualizados en el formulario:', itemsFormArray.value);
    } else {
      console.error('El control "items" no es un FormArray');
    }
  }
  
  // Actualiza las opciones y muestra los campos adicionales según el método de pago seleccionado
  updateDropdownOptions(option: string): void {
    this.selectedOption = option;
  
    // Resetear los valores de los campos adicionales
    this.referenceNumber = '';
    this.phoneNumber = '';
    this.idNumber = '';
    this.batchNumber = '';
  
    // Variable para almacenar el valor de codTarj
    let codTarjValue = '';
  
    // Lógica para asignar el valor de codTarj según la opción seleccionada
    switch (option) {
      case 'USD':
        codTarjValue = 'USD'; // Para pagos en dólares
        this.descrip = 'Divisas';
        break;
        
      case '-EFE-':
        codTarjValue = '-EFE-'; // Para pagos en efectivo
        this.descrip = 'Efectivo';
        break;
  
      case '0134':
        codTarjValue = '0134'; // Para otro tipo de pagos
        this.descrip = 'Banesco';
        break;
  
      case '0134M':
        codTarjValue = '0134M'; // Pago móvil Banesco
        this.descrip = 'Banesco Pago Móvil';
        // Aquí puedes agregar lógica adicional para campos como teléfono e identificación
        break;
  
      case '0134P':
        codTarjValue = '0134P'; // POS Banesco
        this.descrip = 'Banesco POS';
        // Aquí puedes agregar lógica adicional para el número de lote
        break;
  
      default:
        codTarjValue = ''; // Valor predeterminado si no se selecciona una opción válida
        break;
    }
  }

 // Método para calcular la suma total de todos los montos actuales
 getTotalPayments(): number {
  return this.paymentsList.reduce((acc, payment) => acc + payment.monto, 0);
}

// Método para calcular el saldo restante
getRemainingBalance(): number {
  const itemFactTotal = this.itemFactItems.reduce((acc, item) => acc + (parseFloat(item.montoneto) || 0), 0);
  return this.totalBs - this.getTotalPayments() - itemFactTotal;
}

isFormValid(): boolean {
  if (!this.formattedTotalBs || this.formattedTotalBs <= 0) {
    return false;
  }

  if (this.selectedOption === '0134M') {
    return this.idNumber.trim() !== '' && this.phoneNumber.trim() !== '' && this.getRemainingBalance() === 0;
  }

  if (this.selectedOption === '0134P') {
    return this.batchNumber.trim() !== '' && this.getRemainingBalance() === 0;
  }

  return this.getRemainingBalance() === 0;
}

addPayment(): void {
  // Verificar si el monto es válido
  if (!this.formattedTotalBs || isNaN(this.formattedTotalBs) || this.formattedTotalBs <= 0) {
    alert('Por favor ingresa un monto válido.');
    return;
  }

  const monto = parseFloat(this.formattedTotalBs.toString()); // Asegurarse de que sea un número
  const igtf = monto * 0.16; // Calculamos el IGTF (16% del monto)
  const montoDolares = this.totalUsd // Calculamos el monto en dólares (asumiendo que tienes una tasa de cambio)

  // Verificar campos adicionales según la opción seleccionada
  if (this.selectedOption === '0134M') {
    if (!this.idNumber || !this.idNumber.trim() || !this.phoneNumber || !this.phoneNumber.trim()) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor completa todos los campos requeridos para Pago Móvil.'
      });
      return;
    }
  }

  if (this.selectedOption === '0134P') {
    if (!this.batchNumber || !this.batchNumber.trim()) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor completa todos los campos requeridos para Pago POS.'
      });
      return;
    }
  }

  // Calculamos la suma actual de los pagos + el nuevo monto que se va a añadir
  const currentTotal = this.getTotalPayments() + monto;

  // Verificar si la suma actual excede el totalBs
  if (currentTotal > this.totalBs) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'La suma de los pagos no puede exceder el total de ' + this.totalBs + ' Bs.'
    });

    return; // Detenemos la ejecución si se supera el total
  }

  // Añadir el nuevo pago a la lista
  this.paymentsList.push({ 
    tipoPago: this.descrip, 
    monto, 
    montoDolares, 
    igtf 
  });

  // También lo agregamos al FormArray
  const paymentsFormArray = this.registerForm.get('payments') as FormArray;
  const newPayment = this.fb.group({
    tipoPago: this.selectedOption,
    monto: monto,
    montoDolares: montoDolares,
    igtf: igtf,
    fechae: new Date().toISOString(),
  });
  paymentsFormArray.push(newPayment);

  // Opcional: Limpiar el input después de agregar el pago
  this.formattedTotalBs = null;
  this.idNumber = '';
  this.phoneNumber = '';
  this.batchNumber = '';

  // Forzar la detección de cambios para actualizar la vista
  this.cd.detectChanges();
}

  removePayment(index: number): void {
    this.paymentsList.splice(index, 1); // Eliminamos el pago de la lista de pagos
    const paymentsFormArray = this.registerForm.get('payments') as FormArray;
    paymentsFormArray.removeAt(index); // También lo eliminamos del FormArray
  }

  // Método para limpiar el formulario
  clearForm(): void {
    this.selectedOption = '';
    this.referenceNumber = '';
    this.phoneNumber = '';
    this.idNumber = '';
    this.batchNumber = '';

    this.paymentsList = []; // Vacía la lista de pagos
    const paymentsFormArray = this.registerForm.get('payments') as FormArray;
    while (paymentsFormArray.length !== 0) {
      paymentsFormArray.removeAt(0); // Elimina todos los elementos del FormArray
    }
  }

  

  submitForm(): void {
    if (this.registerForm) {
      this.isLoading.set(true);

      // Mostrar el contenido del formulario en la consola
      console.log('Contenido del formulario antes de enviar:', this.registerForm.value);

      // Asegurarse de que el array de payments solo tenga un objeto y eliminar el campo igtf
      const paymentsFormArray = this.registerForm.get('payments') as FormArray;
      if (paymentsFormArray.length > 0) {
        const firstPayment = paymentsFormArray.at(0).value;
        delete firstPayment.igtf;
        paymentsFormArray.clear();
        paymentsFormArray.push(this.fb.group(firstPayment));
      }

      // Mostrar el contenido del formulario sin igtf en la consola
      console.log('Contenido del formulario sin IGTF antes de enviar:', this.registerForm.value);

      this.registerInvoiceService.submitInvoice(this.registerForm).subscribe(
        (response) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Formulario enviado exitosamente'
          });

          // Obtener el selectedNumerod del local storage
          const selectedNumerod = localStorage.getItem('selectedNumerod');
          if (selectedNumerod) {
            // Actualizar el saldo de la CXC a 0
            this.invoiceFormService.updateCxcSaldoToZero().subscribe(
              (response) => {
                console.log('Saldo de la CXC actualizado a 0:', response);
                this.messageService.add({ 
                  severity: 'success', 
                  summary: 'Éxito', 
                  detail: 'Saldo de la CXC actualizado a 0'
                });

                // Redirigir a la página de "home" después de 1 segundo
                setTimeout(() => {
                  // Borrar los elementos del local storage
                  localStorage.removeItem('invoiceItems');
                  localStorage.removeItem('itemFact');
                  localStorage.removeItem('selectedNumerod');

                  this.dialogRef.close();
                  window.location.href = window.location.href;
                }, 1000); // 1000 ms = 1 segundo
              },
              (error) => {
                console.error('Error al actualizar el saldo de la CXC:', error);
                this.messageService.add({ 
                  severity: 'error', 
                  summary: 'Error', 
                  detail: 'Hubo un error al actualizar el saldo de la CXC'
                });
                this.isLoading.set(false);
              }
            );
          } else {
            // Redirigir a la página de "home" después de 1 segundo
            setTimeout(() => {
              // Borrar los elementos del local storage
              localStorage.removeItem('invoiceItems');
              localStorage.removeItem('itemFact');

              this.dialogRef.close();
              window.location.href = window.location.href;
            }, 1000); // 1000 ms = 1 segundo
          }
        },
        (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.'
          });
          // Desactivar el estado de carga una vez completada la solicitud
          this.isLoading.set(false);
        }
      );
    } else {
      console.error('El formulario no está inicializado.');
    }
  }

onDropdownChange(event: any): void {
  this.selectedOption = event.value;
}


}
