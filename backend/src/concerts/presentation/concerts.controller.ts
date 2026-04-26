import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateConcertUseCase } from '../application/use-cases/create-concert.use-case';
import { DeleteConcertUseCase } from '../application/use-cases/delete-concert.use-case';
import { FindAllConcertsUseCase } from '../application/use-cases/find-all-concerts.use-case';
import { FindConcertByIdUseCase } from '../application/use-cases/find-concert-by-id.use-case';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ConcertListItemResponseDto, toConcertListItemDto } from './dto/concert-response.dto';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { RolesGuard } from '../../roles/roles.guard';
import { CreateReservationUseCase } from '../../reservations/application/use-cases/create-reservation.use-case';
import {
    ReservationResponseDto,
    toReservationResponseDto,
} from '../../reservations/presentation/dto/reservation-response.dto';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

type ReqWithUser = { user: JwtPayloadType };

@ApiTags('Concerts')
@Controller({ version: '1', path: 'concerts' })
export class ConcertsController {
    constructor(
        private readonly createConcert: CreateConcertUseCase,
        private readonly deleteConcert: DeleteConcertUseCase,
        private readonly findAll: FindAllConcertsUseCase,
        private readonly findById: FindConcertByIdUseCase,
        private readonly createReservation: CreateReservationUseCase,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleEnum.admin)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: ConcertListItemResponseDto })
    async create(
        @Request() request: ReqWithUser,
        @Body() body: CreateConcertDto,
    ): Promise<ConcertListItemResponseDto> {
        const c = await this.createConcert.execute(String(request.user.id), body);
        const view = await this.findById.execute(c.id);
        return toConcertListItemDto(view);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOkResponse({ type: [ConcertListItemResponseDto] })
    list(): Promise<ConcertListItemResponseDto[]> {
        return this.findAll.execute().then((rows) => rows.map((r) => toConcertListItemDto(r)));
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ type: ConcertListItemResponseDto })
    one(@Param('id') id: string): Promise<ConcertListItemResponseDto> {
        return this.findById.execute(id).then((v) => toConcertListItemDto(v));
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleEnum.admin)
    @Delete(':id')
    @ApiParam({ name: 'id' })
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
        return this.deleteConcert.execute(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(RoleEnum.user, RoleEnum.admin)
    @Post(':id/reservations')
    @ApiParam({ name: 'id' })
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: ReservationResponseDto })
    reserve(
        @Request() request: ReqWithUser,
        @Param('id') id: string,
    ): Promise<ReservationResponseDto> {
        return this.createReservation
            .execute(String(request.user.id), id)
            .then((r) => toReservationResponseDto(r));
    }
}
